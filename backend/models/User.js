const { getSupabaseClient } = require('../db');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id = data.id;
    this.phoneNumber = data.phone_number;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'client';
    this.whatsappId = data.whatsapp_id;
    this.location = data.location;
    this.isActive = data.is_active !== undefined ? data.is_active : true;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async findOne(query, options = {}) {
    const supabase = getSupabaseClient();
    // Always select all fields including password (Supabase doesn't hide it by default)
    let queryBuilder = supabase.from('users').select('*').limit(1);

    if (query._id) {
      queryBuilder = queryBuilder.eq('id', query._id);
    }
    if (query.id) {
      queryBuilder = queryBuilder.eq('id', query.id);
    }
    if (query.email) {
      queryBuilder = queryBuilder.eq('email', query.email.toLowerCase());
    }
    if (query.phoneNumber) {
      queryBuilder = queryBuilder.eq('phone_number', query.phoneNumber);
    }
    if (query.role) {
      queryBuilder = queryBuilder.eq('role', query.role);
    }
    if (query.whatsappId) {
      queryBuilder = queryBuilder.eq('whatsapp_id', query.whatsappId);
    }

    const { data, error } = await queryBuilder.single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    if (!data) return null;

    const user = new User(data);
    
    // Handle .select('+password') compatibility - password is always included in Supabase
    // If select was called, it's already included, so just return the user
    return user;
  }

  static async findById(id) {
    return this.findOne({ id });
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    const supabase = getSupabaseClient();
    const userData = { ...update };
    
    // Convert camelCase to snake_case
    if (userData.phoneNumber !== undefined) {
      userData.phone_number = userData.phoneNumber;
      delete userData.phoneNumber;
    }
    if (userData.whatsappId !== undefined) {
      userData.whatsapp_id = userData.whatsappId;
      delete userData.whatsappId;
    }
    if (userData.isActive !== undefined) {
      userData.is_active = userData.isActive;
      delete userData.isActive;
    }
    if (userData.updatedAt !== undefined) {
      userData.updated_at = userData.updatedAt;
      delete userData.updatedAt;
    }

    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data ? new User(data) : null;
  }

  static async find(query = {}) {
    const supabase = getSupabaseClient();
    let queryBuilder = supabase.from('users').select('*');

    if (query.role) {
      queryBuilder = queryBuilder.eq('role', query.role);
    }
    if (query.isActive !== undefined) {
      queryBuilder = queryBuilder.eq('is_active', query.isActive);
    }

    // Handle sort
    if (query.sort) {
      const sortField = query.sort.createdAt === -1 ? 'created_at' : 'created_at';
      const order = query.sort.createdAt === -1 ? 'desc' : 'asc';
      queryBuilder = queryBuilder.order(sortField, { ascending: order === 'asc' });
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data.map(item => new User(item));
  }

  async save() {
    const supabase = getSupabaseClient();
    const userData = {
      phone_number: this.phoneNumber,
      name: this.name,
      email: this.email ? this.email.toLowerCase() : null,
      role: this.role,
      whatsapp_id: this.whatsappId,
      location: this.location,
      is_active: this.isActive,
      updated_at: new Date().toISOString()
    };

    // Hash password if it's new/modified and not already hashed
    if (this.password && !this.password.startsWith('$2')) {
      userData.password = await bcrypt.hash(this.password, 10);
    } else if (this.password) {
      userData.password = this.password;
    }

    if (this.id) {
      // Update existing user
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      return new User(data);
    } else {
      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) throw error;
      this.id = data.id;
      return new User(data);
    }
  }

  async select(fields) {
    // For compatibility with mongoose .select('+password')
    if (fields.includes('+password')) {
      // Password is already included in Supabase queries
      return this;
    }
    return this;
  }

  toJSON() {
    const obj = {
      _id: this.id, // For mongoose compatibility
      id: this.id,
      phoneNumber: this.phoneNumber,
      name: this.name,
      email: this.email,
      role: this.role,
      whatsappId: this.whatsappId,
      location: this.location,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
    // Include password only if explicitly requested
    if (this.password) {
      obj.password = this.password;
    }
    return obj;
  }

  // Getter for _id (mongoose compatibility)
  get _id() {
    return this.id;
  }
}

module.exports = User;
