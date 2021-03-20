// Requirements
const mongoose = require('mongoose');
const AdminBro = require('admin-bro');
const AdminBroExpressjs = require('@admin-bro/express');
const bcrypt = require('bcrypt');
const  {Topic, Question} = require('../models/Topic');
const  { Company , Experience } = require('../models/Company');
const User = require('../models/User');
const adminUser = require('../models/adminUser');

// We have to tell AdminBro that we will manage mongoose resources with it
AdminBro.registerAdapter(require('@admin-bro/mongoose'));


// RBAC functions
const canModify = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin';

// Pass all configuration settings to AdminBro
const adminBro = new AdminBro({
  resources: [{
    resource: Topic,
    options: {
      properties: {
        ownerId: { isVisible: { edit: false, show: true, list: true, filter: true } }
      },
      actions: {
        edit: { isAccessible: canModify },
        delete: { isAccessible: canModify },
        new: { isAccessible: canModify }
      }
    }
  },{
    resource: Question,
    options: {
      properties: {
        ownerId: { isVisible: { edit: false, show: true, list: true, filter: true } }
      },
      actions: {
        edit: { isAccessible: canModify },
        delete: { isAccessible: canModify },
        new: { isAccessible: canModify }
      }
    }
  },{
    resource: Company,
    options: {
      properties: {
        ownerId: { isVisible: { edit: false, show: true, list: true, filter: true } }
      },
      actions: {
        edit: { isAccessible: canModify },
        delete: { isAccessible: canModify },
        new: { isAccessible: canModify }
      }
    }
  },{
    resource: Experience,
    options: {
      properties: {
        ownerId: { isVisible: { edit: false, show: true, list: true, filter: true }},
        //exp: { type: 'textarea'}
      },
      listProperties: ['personname', 'branch', 'year',  'companyname', 'approved'],
      showProperties: ['personname', 'branch', 'year',  'companyname', 'approved'],
      editProperties: ['personname', 'branch', 'year',  'companyname', 'approved'],
      filterProperties: ['personname', 'branch', 'year',  'companyname', 'approved'],
      actions: {
        edit: { isAccessible: canModify },
        delete: { isAccessible: canModify },
        new: { isAccessible: canModify }
      }
    }
  },{
    resource: User,
    options: {
      properties: {
        ownerId: { isVisible: { edit: false, show: true, list: true, filter: true },}
      },
      actions: {
        edit: { isAccessible: canModify },
        delete: { isAccessible: canModify },
        new: { isAccessible: canModify }
      }
    }
  },{
    resource: adminUser,
    options: {
      properties: {
        ownerId: { isVisible: { edit: false, show: true, list: true, filter: true } }
      },
      actions: {
        edit: { isAccessible: canModify },
        delete: { isAccessible: canModify },
        new: { isAccessible: canModify }
      }
    }
  }],
  rootPath: '/admin',
})

// Build and use a router which will handle all AdminBro routes
const adminRouter = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await adminUser.findOne({ email })
    if (user) {
      const matched = await bcrypt.compare(password, user.password)
      if (matched) {
        return user
      }
    }
    return false
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
})


module.exports = adminRouter;