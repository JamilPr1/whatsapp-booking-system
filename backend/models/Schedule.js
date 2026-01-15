const { getSupabaseClient } = require('../db');

class Schedule {
  constructor(data) {
    this.id = data.id;
    this.date = data.date;
    this.district = data.district;
    this.providerId = data.provider_id;
    this.driverId = data.driver_id;
    this.bookings = data.bookings || []; // UUID array
    this.isLocked = data.is_locked !== undefined ? data.is_locked : false;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async findOne(query) {
    const supabase = getSupabaseClient();
    let queryBuilder = supabase.from('schedules').select('*').limit(1);

    if (query._id) {
      queryBuilder = queryBuilder.eq('id', query._id);
    }
    if (query.id) {
      queryBuilder = queryBuilder.eq('id', query.id);
    }
    if (query.date) {
      const dateStr = query.date instanceof Date 
        ? query.date.toISOString().split('T')[0] 
        : query.date;
      queryBuilder = queryBuilder.eq('date', dateStr);
    }
    if (query.district) {
      queryBuilder = queryBuilder.eq('district', query.district);
    }

    const { data, error } = await queryBuilder.single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data ? new Schedule(data) : null;
  }

  static async findById(id) {
    return this.findOne({ id });
  }

  static async find(query = {}) {
    const supabase = getSupabaseClient();
    let queryBuilder = supabase.from('schedules').select('*');

    if (query.date) {
      const dateStr = query.date instanceof Date 
        ? query.date.toISOString().split('T')[0] 
        : query.date;
      queryBuilder = queryBuilder.eq('date', dateStr);
    }
    if (query.district) {
      queryBuilder = queryBuilder.eq('district', query.district);
    }

    // Handle sort
    if (query.sort) {
      const sortField = query.sort.date === -1 ? 'date' : 'date';
      const order = query.sort.date === -1 ? 'desc' : 'asc';
      queryBuilder = queryBuilder.order(sortField, { ascending: order === 'asc' });
    } else {
      queryBuilder = queryBuilder.order('date', { ascending: true });
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data.map(item => new Schedule(item));
  }

  async save() {
    const supabase = getSupabaseClient();
    const scheduleData = {
      date: this.date instanceof Date 
        ? this.date.toISOString().split('T')[0] 
        : this.date,
      district: this.district,
      provider_id: this.providerId,
      driver_id: this.driverId,
      bookings: this.bookings,
      is_locked: this.isLocked,
      updated_at: new Date().toISOString()
    };

    if (this.id) {
      // Update existing schedule
      const { data, error } = await supabase
        .from('schedules')
        .update(scheduleData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      return new Schedule(data);
    } else {
      // Create new schedule
      const { data, error } = await supabase
        .from('schedules')
        .insert(scheduleData)
        .select()
        .single();

      if (error) throw error;
      this.id = data.id;
      return new Schedule(data);
    }
  }

  toJSON() {
    return {
      _id: this.id,
      id: this.id,
      date: this.date,
      district: this.district,
      providerId: this.providerId,
      driverId: this.driverId,
      bookings: this.bookings,
      isLocked: this.isLocked,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  get _id() {
    return this.id;
  }
}

module.exports = Schedule;
