import {
    DAYLIGHT_PENALTY,
    DEW_POINT_THRESHOLDS,
    MARINE_SUB_WEIGHTS,
    MARINE_THRESHOLDS,
    PRECIP_PROB_LAMBDA,
    PRECIP_PROB_THRESHOLDS,
    PRECIP_THRESHOLDS,
    TEMP_PENALTY_RATES,
    WIND_CHOP_EPSILON,
    WIND_GUST_THRESHOLDS,
} from './constants';

/**
 * Clamps a value between 0 and 100
 */
function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/**
 * Temperature penalty function
 * fT(T) = min(100, ac * (Tlow - T))  when T ≤ Tlow
 *       = 0                           when Tlow < T < Thigh
 *       = min(100, ah * (T - Thigh))  when T ≥ Thigh
 */
export function temperaturePenalty(
  temp: number,
  Tlow: number,
  Thigh: number,
  coldRate: number = TEMP_PENALTY_RATES.coldRate,
  heatRate: number = TEMP_PENALTY_RATES.heatRate
): number {
  if (temp <= Tlow) {
    return clamp(coldRate * (Tlow - temp));
  }
  if (temp >= Thigh) {
    return clamp(heatRate * (temp - Thigh));
  }
  return 0;
}

/**
 * Wind gust penalty function
 * fG(G) = 0                            when G ≤ G0
 *       = min(100, 100 * (G - G0) / (G100 - G0))  when G > G0
 */
export function windGustPenalty(
  gust: number,
  G0: number = WIND_GUST_THRESHOLDS.G0,
  G100: number = WIND_GUST_THRESHOLDS.G100
): number {
  if (gust <= G0) {
    return 0;
  }
  return clamp((100 * (gust - G0)) / (G100 - G0));
}

/**
 * Precipitation amount penalty function
 * famount(P) = min(100, 100 * (P - P0) / (P100 - P0))
 */
export function precipAmountPenalty(
  amount: number,
  P0: number = PRECIP_THRESHOLDS.P0,
  P100: number = PRECIP_THRESHOLDS.P100
): number {
  if (amount <= P0) {
    return 0;
  }
  return clamp((100 * (amount - P0)) / (P100 - P0));
}

/**
 * Precipitation probability penalty function
 * fPoP(PoP) = 0                                      when PoP ≤ PoP0
 *           = min(100, 100 * (PoP - PoP0) / (PoP100 - PoP0))  when PoP > PoP0
 */
export function precipProbabilityPenalty(
  pop: number,
  PoP0: number = PRECIP_PROB_THRESHOLDS.PoP0,
  PoP100: number = PRECIP_PROB_THRESHOLDS.PoP100
): number {
  if (pop <= PoP0) {
    return 0;
  }
  return clamp((100 * (pop - PoP0)) / (PoP100 - PoP0));
}

/**
 * Combined precipitation penalty (amount + probability)
 * fP = famount(P) + λ * fPoP(PoP)
 */
export function combinedPrecipPenalty(
  amount: number,
  pop: number,
  lambda: number = PRECIP_PROB_LAMBDA
): number {
  const amountPenalty = precipAmountPenalty(amount);
  const probPenalty = precipProbabilityPenalty(pop);
  return clamp(amountPenalty + lambda * probPenalty);
}

/**
 * Dew point penalty function
 * fDP(DP) = 0                                        when DP ≤ DP0
 *         = min(100, 100 * (DP - DP0) / (DP100 - DP0))  when DP > DP0
 */
export function dewPointPenalty(
  dewPoint: number,
  DP0: number = DEW_POINT_THRESHOLDS.DP0,
  DP100: number = DEW_POINT_THRESHOLDS.DP100
): number {
  if (dewPoint <= DP0) {
    return 0;
  }
  return clamp((100 * (dewPoint - DP0)) / (DP100 - DP0));
}

/**
 * Daylight penalty function
 * fD(D) = 0         when D = 1 (day)
 *       = Dnight    when D = 0 (night)
 */
export function daylightPenalty(
  isDay: number,
  Dnight: number = DAYLIGHT_PENALTY
): number {
  return isDay === 1 ? 0 : Dnight;
}

/**
 * Marine penalty function
 * fM(H, P, Hw, Vc) = 100 * clip(
 *   w_height * (H - H0) / (H100 - H0) +
 *   w_period * (P - P0) / (P100 - P0) +  // Note: P100 < P0 (inverted)
 *   w_chop * (r - r0) / (r100 - r0) +
 *   w_current * (V - V0) / (V100 - V0),
 *   0, 1
 * )
 * where r = Hw / (H + ε)
 */
export function marinePenalty(
  waveHeight: number | null | undefined,
  wavePeriod: number | null | undefined,
  windWaveHeight: number | null | undefined,
  currentVelocity: number | null | undefined,
  thresholds = MARINE_THRESHOLDS,
  subWeights = MARINE_SUB_WEIGHTS
): number {
  // If marine data is missing, return 0 (no penalty)
  if (
    waveHeight == null ||
    wavePeriod == null ||
    windWaveHeight == null ||
    currentVelocity == null
  ) {
    return 0;
  }

  const { H0, H100, P0, P100, r0, r100, V0, V100 } = thresholds;
  const { height: wHeight, period: wPeriod, chop: wChop, current: wCurrent } = subWeights;

  // Wave height component
  const heightComponent = waveHeight <= H0 ? 0 : (waveHeight - H0) / (H100 - H0);

  // Wave period component (INVERTED: shorter periods are worse, so P100 < P0)
  const periodComponent = wavePeriod >= P0 ? 0 : (wavePeriod - P0) / (P100 - P0);

  // Wind-chop fraction: r = Hw / (H + ε)
  const chopFraction = windWaveHeight / (waveHeight + WIND_CHOP_EPSILON);
  const chopComponent = chopFraction <= r0 ? 0 : (chopFraction - r0) / (r100 - r0);

  // Current velocity component
  const currentComponent = currentVelocity <= V0 ? 0 : (currentVelocity - V0) / (V100 - V0);

  // Weighted sum, clipped to [0, 1], then scaled to 0-100
  const rawScore =
    wHeight * heightComponent +
    wPeriod * periodComponent +
    wChop * chopComponent +
    wCurrent * currentComponent;

  const clipped = Math.max(0, Math.min(1, rawScore));
  return clipped * 100;
}
