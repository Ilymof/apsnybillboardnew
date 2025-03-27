'use strict'

const ROLES = {
   USER: 0,
   MODERATOR: 1,
   ADMIN: 2
}

const ACCESS_CONTROL = {

   '/api/listing/create': [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
   '/api/listing/update': [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
   '/api/listing/delete': [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
   '/api/listing/extend': [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
   '/api/listing/userlisting': [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
   '/api/listing/userlistings': [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
   '/api/user/login': [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
   '/api/user/refresh': [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],
   '/api/user/logout': [ROLES.USER, ROLES.MODERATOR, ROLES.ADMIN],

   '/api/cities/create': [ROLES.ADMIN],
   '/api/cities/update': [ROLES.ADMIN],
   '/api/cities/delete': [ROLES.ADMIN],
   '/api/categories/create': [ROLES.ADMIN],
   '/api/categories/delete': [ROLES.ADMIN],
   '/api/categories/update': [ROLES.ADMIN],
   '/api/subcategories/create': [ROLES.ADMIN],
   '/api/subcategories/delete': [ROLES.ADMIN],
   '/api/subcategories/update': [ROLES.ADMIN],
   '/api/admin/deleteListing': [ROLES.ADMIN],
   '/api/admin/ban': [ROLES.MODERATOR,ROLES.ADMIN]
}

module.exports = { ROLES, ACCESS_CONTROL }