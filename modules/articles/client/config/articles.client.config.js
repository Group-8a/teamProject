'use strict';

// Configuring the Articles module
angular.module('articles').run(['Menus',
  function (Menus) {
    // Add the articles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Blog Posts',
      state: 'articles',
      type: 'dropdown',
      roles: ['user','admin']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'See Blog Posts',
      state: 'articles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Create a Blog Post',
      state: 'articles.create',
      roles: ['user', 'admin']
    });
  }
]);
