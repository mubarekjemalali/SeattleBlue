## ---------- Build stage ----------
#FROM maven:3.9-eclipse-temurin-21 AS build
#
#WORKDIR /app
#
#COPY . .
#
#RUN mvn clean package -DskipTests
#
#
## ---------- Run stage ----------
#FROM eclipse-temurin:21-jre
#
#WORKDIR /app
#
#COPY --from=build /app/target/*.jar app.jar
#
#EXPOSE 8080
#
#ENTRYPOINT ["java", "-jar", "app.jar"]

# ---------- Stage 1: Build frontend ----------
FROM node:20 AS frontend-build

WORKDIR /app/ui

COPY ui/package*.json ./
RUN npm install

COPY ui/ ./
RUN npm run build


# ---------- Stage 2: Build backend ----------
FROM maven:3.9-eclipse-temurin-21 AS backend-build

WORKDIR /app

COPY pom.xml ./
COPY src ./src

# Copy built frontend into Spring Boot static resources
COPY --from=frontend-build /app/ui/dist ./src/main/resources/static

RUN mvn clean package -DskipTests


# ---------- Stage 3: Runtime ----------
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]