import React from 'react';

export default function Account({ user }) {
  // Защитная проверка: если пользователь почему-то не авторизован
  if (!user) {
    return <div className="container" style={{padding: '50px'}}>Пожалуйста, войдите в систему.</div>;
  }

  // Вспомогательный метод для проверки конкретных прав в массиве ролей
  const hasPermission = (key) => {
    return user.permissions && user.permissions.includes(key);
  };

  return (
    <div className="account-page-layout">
      
      {/* КАРТОЧКА ПРОФИЛЯ ПО ЦЕНТРУ СТРАНИЦЫ */}
      <section className="profile-center-card animate-fade">
        <div className="avatar-placeholder">👤</div>
        <h2 className="user-profile-fio">{user.fullName}</h2>
        <p className="user-profile-email">✉️ {user.email}</p>
        <p className="user-profile-phone">📱 {user.phone}</p>
        <div className="profile-divider"></div>
        <p className="user-profile-regdate">Дата регистрации: <strong>{user.createdAt}</strong></p>
        <div className="user-current-role-badge">Роль: {user.roleName}</div>
      </section>

      {/* ДИНАМИЧЕСКИЙ БЛОК ДЕЙСТВИЙ В СООТВЕТСТВИИ С ПРАВАМИ */}
      <section className="rbac-actions-section">
        <h3 className="actions-section-title">Доступные операции управления</h3>
        
        <div className="actions-dashboard-grid">
          
          {/* Блок 1. Управление ролями */}
          {(hasPermission('create_role_type') || hasPermission('delete_role_type') || hasPermission('edit_role_permissions')) && (
            <div className="action-category-card">
              <h4>🔑 Настройки доступа и ролей</h4>
              <div className="buttons-stack">
                {hasPermission('create_role_type') && <button className="btn btn-dashboard">Создать тип аккаунта</button>}
                {hasPermission('edit_role_permissions') && <button className="btn btn-dashboard">Изменить разрешения</button>}
                {hasPermission('delete_role_type') && <button className="btn btn-dashboard btn-danger-text">Удалить тип аккаунта</button>}
              </div>
            </div>
          )}

          {/* Блок 2. Управление аккаунтами */}
          {(hasPermission('create_account') || hasPermission('delete_account') || hasPermission('edit_account_variables')) && (
            <div className="action-category-card">
              <h4>👥 Модерация пользователей</h4>
              <div className="buttons-stack">
                {hasPermission('create_account') && <button className="btn btn-dashboard">Создать новый аккаунт</button>}
                {hasPermission('edit_account_variables') && <button className="btn btn-dashboard">Параметры учетных записей</button>}
                {hasPermission('delete_account') && <button className="btn btn-dashboard btn-danger-text">Удалить аккаунт</button>}
              </div>
            </div>
          )}

          {/* Блок 3. Управление отелями и номерами */}
          {(hasPermission('create_hotel') || hasPermission('delete_hotel') || hasPermission('create_room') || hasPermission('delete_room')) && (
            <div className="action-category-card">
              <h4>🏢 Управление гостиничной сетью</h4>
              <div className="buttons-stack">
                {hasPermission('create_hotel') && <button className="btn btn-dashboard">Добавить новый отель</button>}
                {hasPermission('create_room') && <button className="btn btn-dashboard">Добавить комнаты в фонд</button>}
                {hasPermission('create_hotels_bulk') && <button className="btn btn-dashboard">Массовый импорт отелей</button>}
                {hasPermission('delete_hotel') && <button className="btn btn-dashboard btn-danger-text">Удалить отель из базы</button>}
              </div>
            </div>
          )}

          {/* Блок 4. Финансы и аудит */}
          {(hasPermission('pay_booking') || hasPermission('refund_payment') || hasPermission('view_personal_data')) && (
            <div className="action-category-card">
              <h4>💳 Финансовый сектор и ПДн</h4>
              <div className="buttons-stack">
                {hasPermission('pay_booking') && <button className="btn btn-dashboard">Провести транзакцию</button>}
                {hasPermission('refund_payment') && <button className="btn btn-dashboard btn-warn-text">Оформить возврат средств</button>}
                {hasPermission('view_personal_data') && <button className="btn btn-dashboard">Просмотр персональных данных (ФЗ-152)</button>}
              </div>
            </div>
          )}

          {/* Блок 5. Контент */}
          {hasPermission('moderate_reviews') && (
            <div className="action-category-card">
              <h4>💬 Модерация комьюнити</h4>
              <div className="buttons-stack">
                <button className="btn btn-dashboard">Модерация отзывов и оценок</button>
              </div>
            </div>
          )}

          {/* Блок 6. Общие списки для чтения */}
          {hasPermission('view_directories') && (
            <div className="action-category-card">
              <h4>📋 Системные реестры (Read-Only)</h4>
              <div className="buttons-stack">
                <button className="btn btn-dashboard">Списки отелей / комнат / броней</button>
              </div>
            </div>
          )}

        </div>
      </section>

    </div>
  );
}