const { getSupabaseClient } = require('../db');

class Service {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.category = data.category || 'main';
    this.parentServiceId = data.parent_service_id;
    this.duration = data.duration;
    this.price = parseFloat(data.price);
    this.depositAmount = parseFloat(data.deposit_amount || 0);
    this.isActive = data.is_active !== undefined ? data.is_active : true;
    this.providerId = data.provider_id;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async findOne(query) {
    const supabase = getSupabaseClient();
    let queryBuilder = supabase.from('services').select('*').limit(1);

    if (query._id) {
      queryBuilder = queryBuilder.eq('id', query._id);
    }
    if (query.id) {
      queryBuilder = queryBuilder.eq('id', query.id);
    }
    if (query.name) {
      queryBuilder = queryBuilder.eq('name', query.name);
    }
    if (query.category) {
      queryBuilder = queryBuilder.eq('category', query.category);
    }
    if (query.isActive !== undefined) {
      queryBuilder = queryBuilder.eq('is_active', query.isActive);
    }

    const { data, error } = await queryBuilder.single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data ? new Service(data) : null;
  }

  static async findById(id) {
    return this.findOne({ id });
  }

  static async find(query = {}) {
    const supabase = getSupabaseClient();
    let queryBuilder = supabase.from('services').select('*');

    if (query.isActive !== undefined) {
      queryBuilder = queryBuilder.eq('is_active', query.isActive);
    }
    if (query.category) {
      queryBuilder = queryBuilder.eq('category', query.category);
    }
    if (query.providerId) {
      queryBuilder = queryBuilder.eq('provider_id', query.providerId);
    }

    // Handle sort
    if (query.sort) {
      if (query.sort.category === 1) {
        queryBuilder = queryBuilder.order('category', { ascending: true });
      }
      if (query.sort.name === 1) {
        queryBuilder = queryBuilder.order('name', { ascending: true });
      }
    } else {
      queryBuilder = queryBuilder.order('category', { ascending: true }).order('name', { ascending: true });
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data.map(item => new Service(item));
  }

  static async countDocuments(query = {}) {
    const supabase = getSupabaseClient();
    let queryBuilder = supabase.from('services').select('*', { count: 'exact', head: true });

    if (query.isActive !== undefined) {
      queryBuilder = queryBuilder.eq('is_active', query.isActive);
    }

    const { count, error } = await queryBuilder;

    if (error) throw error;
    return count || 0;
  }

  async save() {
    const supabase = getSupabaseClient();
    const serviceData = {
      name: this.name,
      description: this.description,
      category: this.category,
      parent_service_id: this.parentServiceId,
      duration: this.duration,
      price: this.price,
      deposit_amount: this.depositAmount,
      is_active: this.isActive,
      provider_id: this.providerId,
      updated_at: new Date().toISOString()
    };

    if (this.id) {
      // Update existing service
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      return new Service(data);
    } else {
      // Create new service
      const { data, error } = await supabase
        .from('services')
        .insert(serviceData)
        .select()
        .single();

      if (error) throw error;
      this.id = data.id;
      return new Service(data);
    }
  }

  async populate(fields) {
    // For Mongoose compatibility
    return this;
  }

  toJSON() {
    return {
      _id: this.id,
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      parentService: this.parentServiceId,
      parentServiceId: this.parentServiceId,
      duration: this.duration,
      price: this.price,
      depositAmount: this.depositAmount,
      isActive: this.isActive,
      providerId: this.providerId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  get _id() {
    return this.id;
  }
}

module.exports = Service;
