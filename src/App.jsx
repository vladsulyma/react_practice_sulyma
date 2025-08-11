import { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

import FiltersPanel from './components/FiltersPanel/FiltersPanel';
import ProductsTable from './components/ProductsTable/ProductsTable';

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

        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;

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
    if (categoryId === null) {
      setSelectedCategories([]);

      return;
    }

    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleSort = field => {
    if (sortField !== field) {
      setSortField(field);
      setSortDirection('asc');
    } else if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else {
      setSortField(null);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <FiltersPanel
          users={usersFromServer}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategories={selectedCategories}
          categories={categoriesFromServer}
          handleCategoryClick={handleCategoryClick}
          handleReset={handleReset}
        />

        <ProductsTable
          products={visibleProducts}
          handleSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      </div>
    </div>
  );
};
