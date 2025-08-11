import React from 'react';
import classNames from 'classnames';

const ProductsTable = ({ products, handleSort, sortField, sortDirection }) => {
  const getSortIconClass = field => {
    if (sortField !== field) return 'fas fa-sort';

    return sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  };

  return (
    <div className="box table-container">
      {products.length === 0 ? (
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
              {[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Product' },
                { key: 'category', label: 'Category' },
                { key: 'user', label: 'Owner' },
              ].map(({ key, label }) => (
                <th key={key}>
                  <span className="is-flex is-flex-wrap-nowrap">
                    {label}
                    <a
                      href="#/"
                      onClick={e => {
                        e.preventDefault();
                        handleSort(key);
                      }}
                    >
                      <span className="icon">
                        <i
                          data-cy="SortIcon"
                          className={getSortIconClass(key)}
                        />
                      </span>
                    </a>
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {products.map(product => (
              <tr data-cy="Product" key={product.id}>
                <td className="has-text-weight-bold" data-cy="ProductId">
                  {product.id}
                </td>
                <td data-cy="ProductName">{product.name}</td>
                <td data-cy="ProductCategory">
                  {product.categoryObj && (
                    <>
                      <span>{product.categoryObj.icon}</span>{' '}
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
  );
};

export default ProductsTable;
