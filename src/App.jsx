import { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');

  const filteredProducts = productsFromServer.map(product => {
    const category = categoriesFromServer.find(
      c => c.id === product.categoryId,
    );
    const user = usersFromServer.find(u => u.id === category?.ownerId);

    return {
      ...product,
      categoryObj: category,
      userObj: user,
    };
  });

  const visibleProducts = (() => {
    let result = filteredProducts;

    if (selectedUser !== 'all') {
      result = result.filter(p => p.userObj && p.userObj.id === selectedUser);
    }

    if (selectedCategories.length > 0) {
      result = result.filter(
        p => selectedCategories.includes(p.categoryObj?.id),
        // eslint-disable-next-line function-paren-newline
      );
    }

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();

      result = result.filter(p => p.name.toLowerCase().includes(lowerQuery));
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === 'category') {
          aValue = a.categoryObj?.title || '';
          bValue = b.categoryObj?.title || '';
        }

        if (sortField === 'user') {
          aValue = a.userObj?.name || '';
          bValue = b.userObj?.name || '';
        }

        if (aValue > bValue) {
          return sortDirection === 'asc' ? 1 : -1;
        }

        if (aValue < bValue) {
          return sortDirection === 'asc' ? -1 : 1;
        }

        return 0;
      });
    }

    return result;
  })();

  const handleReset = () => {
    setSearchQuery('');
    setSortField(null);
    setSortDirection('asc');
    setSelectedCategories([]);
    setSelectedUser('all');
  };

  const handleCategoryClick = categoryId => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  // Sorting logic
  const handleSort = field => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortField(null);
    }
  };

  const getSortIconClass = field => {
    if (sortField !== field) {
      return 'fas fa-sort';
    }

    if (sortDirection === 'asc') {
      return 'fas fa-sort-up';
    }

    return 'fas fa-sort-down';
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

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

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': selectedUser === user.id,
                  })}
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
                  setSelectedCategories([]);
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
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

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a
                        href="#/"
                        onClick={e => {
                          e.preventDefault();
                          handleSort('id');
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={getSortIconClass('id')}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a
                        href="#/"
                        onClick={e => {
                          e.preventDefault();
                          handleSort('name');
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={getSortIconClass('name')}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a
                        href="#/"
                        onClick={e => {
                          e.preventDefault();
                          handleSort('category');
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={getSortIconClass('category')}
                          />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Owner
                      <a
                        href="#/"
                        onClick={e => {
                          e.preventDefault();
                          handleSort('user');
                        }}
                      >
                        <span className="icon">
                          <i
                            data-cy="SortIcon"
                            className={getSortIconClass('user')}
                          />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>
                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.categoryObj && (
                        <>
                          <span>{product.categoryObj.icon}</span>
                          {' - '}
                          <span>{product.categoryObj.title}</span>
                        </>
                      )}
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={classNames({
                        'has-text-danger':
                          product.userObj && product.userObj.sex === 'f',
                        'has-text-link':
                          product.userObj && product.userObj.sex === 'm',
                      })}
                    >
                      {product.userObj && product.userObj.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
