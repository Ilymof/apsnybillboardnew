const pool = require('../config/database');

const { createUserTable } = require('./user');
const { createAdTable } = require('./ad');
const { createCategoryTable, alterAdTableAddCategory  } = require('./category');
const { createRegionTable, alterAdTableAddRegion } = require('./region');
const { createSubcategoryTable, alterAdTableAddSubcategory } = require('./subcategory');
const { createChatTable } = require('./chat');
const { createMessageTable } = require('./message');
const { createBasketTable } = require('./basket');
const { createBasketAdTable } = require('./basketAd');
const { createPhotoTable } = require('./photo');

const createTables = async () => {
    try {
        // Сначала создаем таблицы без зависимостей
        await createUserTable();
        await createCategoryTable();
        await createRegionTable(pool);
        await createSubcategoryTable(pool);
        
        // Затем создаем таблицы с внешними ключами, которые зависят от других таблиц
        await createAdTable();
        await createChatTable(pool);
        await createMessageTable(pool);
        await createBasketTable(pool);
        await createBasketAdTable(pool);
        await createPhotoTable(pool);
        
        // После этого выполняем изменения таблиц с добавлением внешних ключей
        await alterAdTableAddCategory();
        await alterAdTableAddSubcategory();
        await alterAdTableAddRegion();
        
        console.log('Все таблицы успешно созданы и обновлены');
    } catch (err) {
        console.error('Ошибка при создании таблиц:', err.message);
    } finally {
        pool.end(); // Закрытие подключения после выполнения
    }
};

module.exports = { createTables };