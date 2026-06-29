package uiutils

// BehaviorMode is the opt-in client behavior channel for bricks that support
// the @ui8kit/aria hook layer. The empty string means "no behavior hook":
// the brick renders only static ARIA; the consuming app wires its own client
// layer. "ui8kit" emits data-ui8kit-* hook attributes so the registered
// @ui8kit/aria runtime can drive focus and keyboard routing.
//
// Spec api enums use ["", "ui8kit"] from this single source. Keep this list
// in sync with utils/behavior.ts.
const (
	BehaviorModeOff    = ""
	BehaviorModeUI8Kit = "ui8kit"
)

// IsValidBehaviorMode reports whether v is a recognized behavior mode.
func IsValidBehaviorMode(v string) bool {
	switch v {
	case BehaviorModeOff, BehaviorModeUI8Kit:
		return true
	default:
		return false
	}
}

// NormalizeBehaviorMode returns v when it is a recognized mode, otherwise the
// empty string (off). Use it to clamp user input on both SSR and TSX sides.
func NormalizeBehaviorMode(v string) string {
	if IsValidBehaviorMode(v) {
		return v
	}
	return BehaviorModeOff
}
