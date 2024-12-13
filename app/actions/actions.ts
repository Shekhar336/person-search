// app/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { User, userSchema } from './schemas';

// Search for users based on a query
export async function searchUsers(query: string): Promise<User[]> {
  try {
    console.log('Searching users with query:', query);

    // Fetch users from the database matching the query
    const users = await prisma.user.findMany({
      where: {
        name: {
          startsWith: query,
          mode: 'insensitive', // Makes the query case-insensitive
        },
      },
    });

    return users; // Return matching users
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Failed to search users.');
  }
}

// Add a new user to the database
export async function addUser(data: Omit<User, 'id'>): Promise<User> {
  try {
    // Validate user data with Zod schema
    const validatedData = userSchema.omit({ id: true }).parse(data);

    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: validatedData,
    });

    return newUser; // Return the created user
  } catch (error) {
    console.error('Error adding user:', error);
    throw new Error('Failed to add user.');
  }
}