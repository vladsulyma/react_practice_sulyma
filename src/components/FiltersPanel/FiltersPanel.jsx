import React from 'react';
import classNames from 'classnames';

const FiltersPanel = ({
  users,
  selectedUser,
  setSelectedUser,
  searchQuery,
  setSearchQuery,
  selectedCategories,
  categories,
  handleCategoryClick,
  handleReset,
}) => (
  <div className="block">
    <nav className="panel">
      <p className="panel-heading">Filters</p>

      <p className="panel-tabs has-text-weight-bold">
        <a
          data-cy="FilterAllUsers"
          href="#/"
          className={classNames({ 'is-active': selectedUser === 'all' })}
          onClick={e => {
            e.preventDefault();
            setSelectedUser('all');
          }}
        >
          All
        </a>

        {users.map(user => (
          <a
            key={user.id}
            data-cy="FilterUser"
            href="#/"
            className={classNames({ 'is-active': selectedUser === user.id })}
            onClick={e => {
              e.preventDefault();
              setSelectedUser(user.id);
            }}
          >
            {user.name}
          </a>
        ))}
      </p>

      <div className="panel-block">
        <p className="control has-icons-left has-icons-right">
          <input
            data-cy="SearchField"
            type="text"
            className="input"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          <span className="icon is-left">
            <i className="fas fa-search" aria-hidden="true" />
          </span>

          {searchQuery && (
            <span className="icon is-right">
              <button
                data-cy="ClearButton"
                type="button"
                className="delete"
                onClick={() => setSearchQuery('')}
              />
            </span>
          )}
        </p>
      </div>

      <div className="panel-block is-flex-wrap-wrap">
        <a
          href="#/"
          data-cy="AllCategories"
          className={classNames('button mr-6', {
            'is-success': selectedCategories.length === 0,
            'is-active': selectedCategories.length === 0,
          })}
          onClick={e => {
            e.preventDefault();
            handleCategoryClick(null);
          }}
        >
          All
        </a>

        {categories.map(category => (
          <a
            key={category.id}
            data-cy="Category"
            className={classNames('button mr-2 my-1', {
              'is-info': selectedCategories.includes(category.id),
            })}
            href="#/"
            onClick={e => {
              e.preventDefault();
              handleCategoryClick(category.id);
            }}
          >
            {category.title}
          </a>
        ))}
      </div>

      <div className="panel-block">
        <a
          data-cy="ResetAllButton"
          href="#/"
          className="button is-link is-outlined is-fullwidth"
          onClick={e => {
            e.preventDefault();
            handleReset();
          }}
        >
          Reset all filters
        </a>
      </div>
    </nav>
  </div>
);

export default FiltersPanel;
