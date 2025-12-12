// Генератор самодостаточного минифицированного кода для фонов

// Улучшенная минификация
function minify(code) {
  // Удаляем комментарии
  code = code.replace(/\/\*[\s\S]*?\*\//g, '');
  code = code.replace(/\/\/.*$/gm, '');
  
  // Удаляем лишние пробелы и переносы строк
  code = code.replace(/\s+/g, ' ');
  
  // Удаляем пробелы вокруг операторов (но сохраняем пробелы в строках)
  code = code.replace(/\s*([{}();,=+\-*\/<>!&|?:])\s*/g, '$1');
  
  // Удаляем точку с запятой перед закрывающей скобкой
  code = code.replace(/;\s*}/g, '}');
  
  // Удаляем пробелы вокруг двоеточий в объектах
  code = code.replace(/\s*:\s*/g, ':');
  
  // Удаляем пробелы после ключевых слов
  code = code.replace(/\b(if|for|while|function|return|const|let|var)\s+/g, '$1 ');
  
  return code.trim();
}

// Получить имя класса из типа фона
function getClassName(backgroundType) {
  // Преобразуем "crackinjection" в "CrackInjectionBackground"
  // Разбиваем по словам (если есть заглавные буквы) или по camelCase
  let parts;
  if (backgroundType.includes('_')) {
    parts = backgroundType.split('_');
  } else if (/[A-Z]/.test(backgroundType)) {
    parts = backgroundType.split(/(?=[A-Z])/);
  } else {
    // Если все в нижнем регистре, разбиваем по логическим словам
    // Для известных случаев
    const knownPatterns = {
      'crackinjection': ['crack', 'injection'],
      'crackpattern': ['crack', 'pattern'],
      'injectionflow': ['injection', 'flow'],
      'foundationgrid': ['foundation', 'grid'],
      'waterbarrier': ['water', 'barrier'],
      'concreteblocks': ['concrete', 'blocks'],
      'structuralmesh': ['structural', 'mesh'],
      'repairparticles': ['repair', 'particles'],
      'concretetexture2': ['concrete', 'texture', '2'],
      'foundationlines': ['foundation', 'lines'],
      'structuralrepair': ['structural', 'repair'],
      'concretesurface': ['concrete', 'surface'],
      'injectionpattern': ['injection', 'pattern'],
      'foundationmesh': ['foundation', 'mesh'],
      'waterproofmembrane': ['waterproof', 'membrane'],
      'epoxyinjection': ['epoxy', 'injection'],
      'foundationstructure': ['foundation', 'structure'],
      'polyurethaneflow': ['polyurethane', 'flow'],
      'crackrepair': ['crack', 'repair'],
      'crackhealing': ['crack', 'healing'],
      'interactivecracks': ['interactive', 'cracks'],
      'repairprocess': ['repair', 'process'],
      'cracksealing': ['crack', 'sealing'],
      'particles2': ['particles', '2'],
      'particles3': ['particles', '3'],
      'particles4': ['particles', '4'],
      'waves2': ['waves', '2'],
      'geometric2': ['geometric', '2'],
      'geometric3': ['geometric', '3'],
      'gradient2': ['gradient', '2'],
      'parallax2': ['parallax', '2'],
    };
    
    if (knownPatterns[backgroundType]) {
      parts = knownPatterns[backgroundType];
    } else {
      // Пытаемся разбить по общим словам
      parts = [backgroundType];
    }
  }
  
  const camelCase = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  return camelCase + 'Background';
}

// Генерация самодостаточного кода из исходного файла
export async function generateStandaloneCode(backgroundType) {
  try {
    // Пытаемся загрузить исходный файл (работает в dev режиме)
    const response = await fetch(`./src/js/backgrounds/${backgroundType}.js`);
    if (!response.ok) {
      // Пробуем альтернативный путь
      const altResponse = await fetch(`./backgrounds/${backgroundType}.js`);
      if (!altResponse.ok) {
        throw new Error('File not found');
      }
      return await processCode(await altResponse.text(), backgroundType);
    }
    
    return await processCode(await response.text(), backgroundType);
  } catch (error) {
    console.warn('Не удалось загрузить файл через fetch:', error);
    return generateFallbackCode(backgroundType);
  }
}

// Обработка кода и создание HTML
async function processCode(code, backgroundType) {
  const className = getClassName(backgroundType);
  
  // Удаляем export default
  code = code.replace(/export\s+default\s+/g, '');
  
  // Минифицируем код
  const minifiedCode = minify(code);
  
  // Создаем самодостаточный HTML с встроенным JavaScript
  const html = `<!-- Интерактивный фон: ${backgroundType} -->
<!-- Скопируйте и вставьте этот код на ваш сайт -->

<div id="bg-${backgroundType}" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;"></div>

<script>
(function(){
'use strict';
${minifiedCode}
const container=document.getElementById('bg-${backgroundType}');
if(container){
  const bg=new ${className}(container);
  window.addEventListener('beforeunload',function(){if(bg&&bg.destroy)bg.destroy();});
}
})();
</script>

<style>
#bg-${backgroundType}{position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;}
#bg-${backgroundType} canvas{display:block;width:100%;height:100%;}
</style>`;
  
  return html;
}

// Резервный код, если файл не найден
function generateFallbackCode(backgroundType) {
  const className = getClassName(backgroundType);
  
  return `<!-- Интерактивный фон: ${backgroundType} -->
<!-- ВНИМАНИЕ: Не удалось загрузить исходный код. -->
<!-- Пожалуйста, используйте файл: src/js/backgrounds/${backgroundType}.js -->

<div id="bg-${backgroundType}" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;"></div>

<script>
// Вам нужно скопировать код из файла src/js/backgrounds/${backgroundType}.js
// и вставить его здесь, заменив export default на обычное объявление класса

// Пример использования:
// const container=document.getElementById('bg-${backgroundType}');
// const bg=new ${className}(container);
</script>

<style>
#bg-${backgroundType}{position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;}
#bg-${backgroundType} canvas{display:block;width:100%;height:100%;}
</style>`;
}

// Альтернативный метод - генерация из строки кода
export function generateFromCodeString(backgroundType, codeString) {
  const className = getClassName(backgroundType);
  
  // Удаляем export default
  let code = codeString.replace(/export\s+default\s+/g, '');
  
  // Минифицируем
  const minifiedCode = minify(code);
  
  // Создаем HTML
  const html = `<!-- Интерактивный фон: ${backgroundType} -->
<!-- Скопируйте и вставьте этот код на ваш сайт -->

<div id="bg-${backgroundType}" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;"></div>

<script>
(function(){
'use strict';
${minifiedCode}
const container=document.getElementById('bg-${backgroundType}');
if(container){
  const bg=new ${className}(container);
  window.addEventListener('beforeunload',function(){if(bg&&bg.destroy)bg.destroy();});
}
})();
</script>

<style>
#bg-${backgroundType}{position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;}
#bg-${backgroundType} canvas{display:block;width:100%;height:100%;}
</style>`;
  
  return html;
}
