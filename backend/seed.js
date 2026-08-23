import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import UserAdmin from './models/userAdmin.model.js';
import UserResident from './models/userResident.model.js';
import { connectDB } from './config/db.js';

dotenv.config();

const seedDB = async () => {
    try {
        await connectDB();
        
        console.log('Seeding data...');

        const defaultPassword = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultPassword, salt);

        // Seed Admin
        let admin = await UserAdmin.findOne({ email: 'admin@canbrs.com' });
        if (!admin) {
            admin = new UserAdmin({
                name: 'System Admin',
                sitio: 'Palao',
                email: 'admin@canbrs.com',
                phone: '09000000000',
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });
            await admin.save();
            console.log(`Admin account created! Email: admin@canbrs.com | Password: ${defaultPassword}`);
        } else {
            admin.password = hashedPassword;
            await admin.save();
            console.log(`Admin account updated! Email: admin@canbrs.com | Password: ${defaultPassword}`);
        }

        // Seed Resident
        let resident = await UserResident.findOne({ phone: '09123456789' });
        if (!resident) {
            resident = new UserResident({
                firstname: 'Juan',
                lastname: 'Dela Cruz',
                birthdate: new Date('1990-01-01'),
                gender: 'Male',
                blknum: '1',
                lotnum: '2',
                sitio: 'Manfil',
                phone: '09123456789',
                password: hashedPassword,
                validIdNumber: 123456789,
                role: 'resident',
                isVerified: true,
                isApproved: true
            });
            await resident.save();
            console.log(`Resident account created! Phone: 09123456789 | Password: ${defaultPassword}`);
        } else {
            resident.password = hashedPassword;
            await resident.save();
            console.log(`Resident account updated! Phone: 09123456789 | Password: ${defaultPassword}`);
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};

seedDB();
