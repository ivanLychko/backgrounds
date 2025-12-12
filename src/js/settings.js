// Конфигурация настроек для каждого фона
export const backgroundSettings = {
  particle: {
    particleCount: { type: 'range', label: 'Количество частиц', min: 20, max: 300, value: 100, step: 10 },
    connectionDistance: { type: 'range', label: 'Расстояние соединения', min: 50, max: 200, value: 120, step: 10 },
    mouseInteraction: { type: 'range', label: 'Взаимодействие с мышью', min: 50, max: 300, value: 150, step: 10 },
    particleSpeed: { type: 'range', label: 'Скорость частиц', min: 0.1, max: 2, value: 0.5, step: 0.1 },
    particleSize: { type: 'range', label: 'Размер частиц', min: 0.5, max: 5, value: 1.5, step: 0.5 },
    backgroundColor: { type: 'color', label: 'Цвет фона', value: 'rgba(10, 10, 20, 0.1)' },
  },
  wave: {
    waveAmplitude: { type: 'range', label: 'Амплитуда волн', min: 20, max: 100, value: 50, step: 5 },
    waveFrequency: { type: 'range', label: 'Частота волн', min: 0.005, max: 0.03, value: 0.01, step: 0.005 },
    waveSpeed: { type: 'range', label: 'Скорость волн', min: 0.01, max: 0.1, value: 0.02, step: 0.01 },
    mouseInfluence: { type: 'range', label: 'Влияние мыши', min: 0, max: 200, value: 100, step: 10 },
  },
  geometric: {
    shapeCount: { type: 'range', label: 'Количество фигур', min: 5, max: 30, value: 15, step: 1 },
    shapeSize: { type: 'range', label: 'Размер фигур', min: 20, max: 100, value: 50, step: 5 },
    rotationSpeed: { type: 'range', label: 'Скорость вращения', min: 0.01, max: 0.1, value: 0.02, step: 0.01 },
    mouseDistance: { type: 'range', label: 'Дистанция мыши', min: 50, max: 300, value: 150, step: 10 },
  },
  gradient: {
    gradientSpeed: { type: 'range', label: 'Скорость градиента', min: 0.1, max: 2, value: 0.5, step: 0.1 },
    mouseFollow: { type: 'range', label: 'Следование за мышью', min: 0, max: 100, value: 50, step: 10 },
  },
  parallax: {
    gridSize: { type: 'range', label: 'Размер сетки', min: 20, max: 80, value: 50, step: 5 },
    parallaxDepth: { type: 'range', label: 'Глубина параллакса', min: 0.1, max: 1, value: 0.5, step: 0.1 },
    connectionDistance: { type: 'range', label: 'Расстояние соединений', min: 100, max: 300, value: 200, step: 20 },
  },
  crackinjection: {
    crackInterval: { type: 'range', label: 'Интервал появления трещин (мс)', min: 1000, max: 5000, value: 2000, step: 500 },
    crackCount: { type: 'range', label: 'Максимум трещин', min: 5, max: 50, value: 30, step: 5 },
    injectionRadius: { type: 'range', label: 'Радиус инжекции', min: 50, max: 150, value: 80, step: 10 },
    injectionSpeed: { type: 'range', label: 'Скорость инжекции', min: 0.5, max: 3, value: 1.5, step: 0.5 },
    scrollSensitivity: { type: 'range', label: 'Чувствительность прокрутки', min: 0.3, max: 1, value: 0.7, step: 0.1 },
  },
  // Добавлю настройки для других популярных фонов
  starfield: {
    starCount: { type: 'range', label: 'Количество звезд', min: 50, max: 500, value: 200, step: 50 },
    starSpeed: { type: 'range', label: 'Скорость звезд', min: 0.1, max: 2, value: 0.5, step: 0.1 },
    connectionDistance: { type: 'range', label: 'Расстояние соединений', min: 50, max: 200, value: 100, step: 10 },
  },
  fluid: {
    particleCount: { type: 'range', label: 'Количество частиц', min: 30, max: 150, value: 80, step: 10 },
    blobRadius: { type: 'range', label: 'Радиус капель', min: 10, max: 60, value: 30, step: 5 },
    connectionDistance: { type: 'range', label: 'Расстояние соединений', min: 80, max: 200, value: 150, step: 10 },
  },
  fire: {
    fireIntensity: { type: 'range', label: 'Интенсивность огня', min: 0.1, max: 0.5, value: 0.3, step: 0.05 },
    fireSpeed: { type: 'range', label: 'Скорость огня', min: 0.5, max: 3, value: 1, step: 0.5 },
  },
  matrix: {
    fontSize: { type: 'range', label: 'Размер шрифта', min: 10, max: 20, value: 14, step: 1 },
    columnSpeed: { type: 'range', label: 'Скорость колонок', min: 0.5, max: 5, value: 1, step: 0.5 },
  },
  rain: {
    dropCount: { type: 'range', label: 'Количество капель', min: 50, max: 500, value: 200, step: 50 },
    dropSpeed: { type: 'range', label: 'Скорость капель', min: 1, max: 10, value: 3, step: 1 },
    dropLength: { type: 'range', label: 'Длина капель', min: 5, max: 30, value: 10, step: 5 },
  },
  snow: {
    flakeCount: { type: 'range', label: 'Количество снежинок', min: 50, max: 300, value: 150, step: 50 },
    flakeSpeed: { type: 'range', label: 'Скорость снежинок', min: 0.5, max: 3, value: 1, step: 0.5 },
    flakeSize: { type: 'range', label: 'Размер снежинок', min: 1, max: 5, value: 2, step: 0.5 },
  },
  circles: {
    circleCount: { type: 'range', label: 'Количество кругов', min: 5, max: 30, value: 20, step: 5 },
    circleSize: { type: 'range', label: 'Размер кругов', min: 20, max: 100, value: 50, step: 10 },
    pulseSpeed: { type: 'range', label: 'Скорость пульсации', min: 0.01, max: 0.05, value: 0.02, step: 0.01 },
  },
  // Базовые настройки для всех остальных фонов
  default: {
    speed: { type: 'range', label: 'Скорость анимации', min: 0.1, max: 2, value: 1, step: 0.1 },
    intensity: { type: 'range', label: 'Интенсивность', min: 0.1, max: 2, value: 1, step: 0.1 },
    mouseSensitivity: { type: 'range', label: 'Чувствительность мыши', min: 0, max: 200, value: 100, step: 10 },
  },
};

// Получить настройки для фона
export function getSettingsForBackground(backgroundType) {
  return backgroundSettings[backgroundType] || backgroundSettings.default;
}

