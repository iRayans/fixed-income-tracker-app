import { authService } from './authService';

export interface Category {
  id?: number;
  name: string;
  description: string;
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch('http://192.168.0.4:8080/api/v1/categories', {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    try {
      const response = await fetch('http://192.168.0.4:8080/api/v1/categories', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async updateCategory({ id, ...category }: Category & { id: number }): Promise<Category> {
    try {
      const response = await fetch(`http://192.168.0.4:8080/api/v1/categories/${id}`, {
        method: 'PUT',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ name: category.name, description: category.description }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async deleteCategory(id: number): Promise<void> {
    try {
      const response = await fetch(`http://192.168.0.4:8080/api/v1/categories/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};
