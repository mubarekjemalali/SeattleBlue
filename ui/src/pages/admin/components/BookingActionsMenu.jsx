// export default function BookingActionsMenu({
//   booking,
//   menuOpen,
//   placement,
//   onToggleMenu,
//   onAssign,
//   onCopyToken,
//   onCancelBooking,
//   canAssign,
//   canCancel,
// }) {
//   const isReassign = !!booking?.driverId;
//   const assignLabel = isReassign ? "Reassign driver" : "Assign driver";
//
//   return (
//     <div className="adminMenu">
//       <button
//         type="button"
//         className="btn btnGhost"
//         onClick={onToggleMenu}
//         style={{ paddingInline: 10 }}
//         aria-label="More actions"
//       >
//         ⋯
//       </button>
//
//       {menuOpen && (
//         <div
//           className="adminMenuPanel"
//           style={placement === "up" ? { top: "auto", bottom: "calc(100% + 8px)" } : undefined}
//         >
//           {canAssign && (
//             <button className="adminMenuItem" type="button" onClick={onAssign}>
//               {assignLabel}
//             </button>
//           )}
//
//           <button className="adminMenuItem" type="button" onClick={onCopyToken}>
//             Copy token
//           </button>
//
//           <button
//             className="adminMenuItem"
//             type="button"
//             disabled
//             title="Endpoint not wired yet"
//             style={{ opacity: 0.55, cursor: "not-allowed" }}
//           >
//             Complete booking
//           </button>
//
//           <button
//             className="adminMenuItem adminMenuItemDanger"
//             type="button"
//             onClick={onCancelBooking}
//             disabled={!canCancel}
//             style={
//               !canCancel
//                 ? { opacity: 0.55, cursor: "not-allowed", color: "#b91c1c" }
//                 : { color: "#b91c1c" }
//             }
//           >
//             Cancel booking
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

export default function BookingActionsMenu({
  booking,
  menuOpen,
  coords,
  onToggleMenu,
  onAssign,
  onCopyToken,
  onCancelBooking,
  canAssign,
  canCancel,
}) {
  const isReassign = !!booking?.driverId;
  const assignLabel = isReassign ? "Reassign driver" : "Assign driver";

  return (
    <div className="adminMenu">
      <button
        type="button"
        className="btn btnGhost"
        onClick={onToggleMenu}
        style={{ paddingInline: 10 }}
        aria-label="More actions"
      >
        ⋯
      </button>

      {menuOpen && coords && (
        <div
          className="adminMenuPanel"
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            zIndex: 9999,
            maxWidth: "max-content",
            maxWidth:170

          }}
        >
          {canAssign && (
            <button className="adminMenuItem" type="button" onClick={onAssign}>
              {assignLabel}
            </button>
          )}

          <button className="adminMenuItem" type="button" onClick={onCopyToken}>
            Copy token
          </button>

          <button
            className="adminMenuItem"
            type="button"
            disabled
            title="Endpoint not wired yet"
            style={{ opacity: 0.55, cursor: "not-allowed" }}
          >
            Complete booking
          </button>

          <button
            className="adminMenuItem adminMenuItemDanger"
            type="button"
            onClick={onCancelBooking}
            disabled={!canCancel}
            style={
              !canCancel
                ? { opacity: 0.55, cursor: "not-allowed", color: "#b91c1c" }
                : { color: "#b91c1c" }
            }
          >
            Cancel booking
          </button>
        </div>
      )}
    </div>
  );
}