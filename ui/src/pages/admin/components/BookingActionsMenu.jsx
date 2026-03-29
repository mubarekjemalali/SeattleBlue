export default function BookingActionsMenu({
  booking,
  menuOpen,
  coords,
  onToggleMenu,
  onAssign,
  onCopyToken,
  onCompleteBooking,
  onCancelBooking,
  canAssign,
  canComplete,
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
         onClick={onCompleteBooking}
         disabled={!canComplete}
         title={!canComplete ? "Only assigned bookings can be completed" : ""}
         style={!canComplete ? { opacity: 0.55, cursor: "not-allowed" } : undefined}
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