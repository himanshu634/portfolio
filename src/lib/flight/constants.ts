/**
 * Tunables for the flight model. Units: world units, seconds, kg=1.
 * Everything the ship does derives from forces integrated at a fixed
 * timestep — there are no tween curves anywhere in the motion pipeline.
 */
export const DT = 1 / 120; // fixed physics timestep (s)
export const MAX_SUBSTEPS = 12; // cap per render frame; drop time beyond this
export const MAX_FRAME_DELTA = 0.1; // clamp tab-switch spikes (s)

export const SHIP_MASS = 1;
export const F_MAX = 34; // max forward/reverse thrust from input
export const F_KEY = 26; // thrust while holding arrow keys
export const F_RETRO_MAX = 55; // autopilot braking thruster limit
export const DRAG_LINEAR = 0.32; // "retro-thrusters", not actual space drag
export const DRAG_QUAD = 0.012; // caps top speed

/** Terminal velocity under full thrust — used to normalize FOV/HUD. */
export const V_MAX = 38;

/** Scroll input: smoothed scroll delta -> throttle force. */
export const SCROLL_GAIN = 1.4;
export const THROTTLE_DECAY = 4.2; // 1/s exponential decay of the burn

/** Waypoint approach. */
export const BRAKE_MARGIN = 1.15; // 15% over required decel
export const V_ORBIT_CAPTURE = 7; // max |v| for orbit insertion
export const CAPTURE_DISTANCE = 1.6; // |s_w - s| considered "at waypoint"
export const ESCAPE_THRUST_TIME = 0.45; // fight the burn this long to fly by

/** Orbit dynamics (angular analogue of the linear sim). */
export const ORBIT_TORQUE_GAIN = 0.16;
export const ORBIT_DRAG = 1.4;
export const ORBIT_ANGV_MAX = 0.9;
export const ORBIT_BASE_DRIFT = 0.045; // ambient orbital drift, rad/s
export const ORBIT_FULL_REVEAL = Math.PI * 1.15; // rad of orbit to reveal all content
export const ORBIT_EXIT_OVERRUN = 0.6; // rad past full reveal before exit
export const ORBIT_INSERT_RATE = 2.4; // 1/s spring rate of path<->ring blend

/** Gravity flybys: tiny pull toward massive bodies, hard capped. */
export const GRAVITY_G = 260;
export const GRAVITY_MAX_ACCEL = 2.2;
export const LATERAL_SPRING = 1.6; // recenters ship onto the path
export const LATERAL_MAX = 3.2; // ship can never be "captured"

/** Camera. */
export const FOV_REST = 60;
export const FOV_CRUISE_MAX = 75;
export const FOV_WARP = 110;
export const CAM_SPRING_K = 28; // critically damped: c = 2*sqrt(k)
export const CAM_BRAKE_PITCH = 0.0045; // rad per unit of braking force

/** Warp. */
export const WARP_CHARGE_TIME = 0.6;
export const WARP_MIN_TIME = 1.5;
export const WARP_MAX_TIME = 2.5;
export const WARP_TIMEOUT_GRACE = 2; // hard escape hatch per timed state
export const WHITEOUT_FRAMES = 2;
export const V_ARRIVAL = 26; // velocity carried out of the wormhole
export const REDUCED_WARP_TIME = 0.35; // crossfade duration when reduced motion

/** Ship feel. */
export const SWAY_AMP = 0.14; // peak sway at full thrust, zero at rest
export const SWAY_FREQ = 0.9;
export const BANK_GAIN = 0.04;
export const BANK_MAX = 0.6;
export const ROLL_DAMP = 1.1; // barrel-roll angular damping
