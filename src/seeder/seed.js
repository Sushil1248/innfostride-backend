const mongoose = require('mongoose');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const User = require('../models/User');
require('dotenv').config();
const bcrypt = require('bcrypt');
const Domain = require('../models/Domain');
mongoose.connect(process.env.MONGODB_URI);

// Function to seed permissions
const seedPermissions = async () => {
    try {
        // Check if permissions already exist
        const existingPermissions = await Permission.find();

        if (existingPermissions.length === 0) {
            // Create permissions
            const permissions = [
                { name: 'create_user', module: 'user' },
                { name: 'edit_user', module: 'user' },
                { name: 'delete_user', module: 'user' },
                { name: 'edit_article', module: 'article' },
                { name: 'delete_article', module: 'article' },
                // Add more permissions as needed
            ];

            // Save permissions to the database
            await Permission.create(permissions);

            console.log('Permissions seeded successfully');
        } else {
            console.log('Permissions already exist. Skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding permissions:', error.message);
    }
};

// Function to seed roles
const seedRoles = async () => {
    try {
        // Check if roles already exist
        const existingRoles = await Role.find();

        if (existingRoles.length === 0) {
            // Create roles
            const roles = [
                { name: 'admin' },
                { name: 'editor' },
                { name: 'user' },
                // Add more roles as needed
            ];

            // Save roles to the database
            await Role.create(roles);

            console.log('Roles seeded successfully');
        } else {
            console.log('Roles already exist. Skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding roles:', error.message);
    }
};

// Function to seed users
const seedUsers = async () => {
    try {
        // Check if users already exist
        const existingUsers = await User.find();

        if (existingUsers.length === 0) {
            // Find roles and permissions from the database
            const adminRole = await Role.findOne({ name: 'admin' });
            const editorRole = await Role.findOne({ name: 'editor' });
            const createUserPermission = await Permission.findOne({ name: 'create_user' });
            const editUserPermission = await Permission.findOne({ name: 'edit_user' });

            // Create sample users with associated roles and permissions
            const users = [
                {
                    username: 'adminUser',
                    password: await bcrypt.hash('adminPassword', 10),
                    email: 'admin@example.com',
                    firstName: 'Admin',
                    lastName: 'User',
                    role: adminRole._id,
                    permissions: [createUserPermission._id, editUserPermission._id],
                },
                // Add more users as needed
            ];

            // Save users to the database
            await User.create(users);

            console.log('Users seeded successfully');
        } else {
            console.log('Users already exist. Skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding users:', error.message);
    } finally {
        // Disconnect from MongoDB after all seeding operations
        mongoose.disconnect();
    }
};

const seedDomains = async () => {
    try {
        // Check if domains already exist
        const existingDomains = await Domain.find();

        if (existingDomains.length === 0) {
            // Create sample domains
            const domains = [
                { name: 'he_group', title:"He-GROUP", href: 'http://hegroup.com' },
                { name: 'the_logician',title:"THE-LOGICIAN", href: 'http://logician.com' },
                { name: 'x_wear',title:"X-WEAR", href: 'http://xwear.com' },
            ];

            // Save domains to the database
            await Domain.create(domains);

            console.log('Domains seeded successfully');
        } else {
            console.log('Domains already exist. Skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding domains:', error.message);
    } finally {
        mongoose.disconnect();
    }
};

// Run the domain seeder
seedDomains();
// Call the functions to seed data
seedPermissions().then(() => {
    seedRoles().then(() => {
        seedUsers();
    });
});