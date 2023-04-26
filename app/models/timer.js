export default class Timer {
}

Timer.getCacheKey = (timerId) => `timer:${timerId}`
Timer.stateCacheTTL = 3 * 24 * 60 * 60 * 1000;
