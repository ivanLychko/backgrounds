import '../styles/main.scss';
import ParticleBackground from './backgrounds/particle.js';
import StructuralMeshBackground from './backgrounds/structuralmesh.js';
import PolyurethaneFlowBackground from './backgrounds/polyurethaneflow.js';
import CrackInjectionBackground from './backgrounds/crackinjection.js';
import CrackInjectionBlueBackground from './backgrounds/crackinjection-blue.js';
import CrackInjectionGreenBackground from './backgrounds/crackinjection-green.js';
import CrackInjectionPurpleBackground from './backgrounds/crackinjection-purple.js';
import CrackInjectionOrangeBackground from './backgrounds/crackinjection-orange.js';

class BackgroundManager {
  constructor() {
    this.currentBackground = null;
    this.currentBackgroundType = null;
    this.backgrounds = {
      particle: ParticleBackground,
      structuralmesh: StructuralMeshBackground,
      polyurethaneflow: PolyurethaneFlowBackground,
      crackinjection: CrackInjectionBackground,
      crackinjectionblue: CrackInjectionBlueBackground,
      crackinjectiongreen: CrackInjectionGreenBackground,
      crackinjectionpurple: CrackInjectionPurpleBackground,
      crackinjectionorange: CrackInjectionOrangeBackground,
    };

    this.container = document.getElementById('backgroundContainer');
    this.init();
  }

  init() {
    // Загружаем первый фон по умолчанию
    this.switchBackground('particle');

    // Бургер-меню для мобильных
    const burgerMenu = document.getElementById('burgerMenu');
    const menuContent = document.getElementById('menuContent');

    if (burgerMenu && menuContent) {
      burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        menuContent.classList.toggle('active');
      });

      // Закрываем меню при клике на кнопку фона (на мобильных)
      menuContent.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-btn') && window.innerWidth <= 768) {
          burgerMenu.classList.remove('active');
          menuContent.classList.remove('active');
        }
      });
    }

    // Обработчик кликов на кнопки
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-btn')) {
        const backgroundType = e.target.dataset.background;
        if (backgroundType) {
          this.switchBackground(backgroundType);

          // Обновляем активное состояние
          document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
          });
          e.target.classList.add('active');
        }
      }
    });
  }

  switchBackground(type) {
    if (this.currentBackground) {
      this.currentBackground.destroy();
    }

    const BackgroundClass = this.backgrounds[type];
    if (BackgroundClass) {
      this.currentBackgroundType = type;
      this.currentBackground = new BackgroundClass(this.container);
    }
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new BackgroundManager();
});
