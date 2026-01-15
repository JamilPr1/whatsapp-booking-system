const { getSupabaseClient } = require('../db');

class Booking {
  constructor(data) {
    this.id = data.id;
    this.clientId = data.client_id;
    this.serviceId = data.service_id;
    this.providerId = data.provider_id;
    this.driverId = data.driver_id;
    this.bookingDate = data.booking_date;
    this.bookingTime = data.booking_time;
    this.location = data.location; // JSONB field
    this.status = data.status || 'pending';
    this.payment = data.payment || {}; // JSONB field
    this.notes = data.notes;
    this.whatsappConversationId = data.whatsapp_conversation_id;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async findOne(query) {
    const supabase = getSupabaseClient();
    let queryBuilder = supabase.from('bookings').select('*').limit(1);

    if (query._id) {
      queryBuilder = queryBuilder.eq('id', query._id);
    }
    if (query.id) {
      queryBuilder = queryBuilder.eq('id', query.id);
    }
    if (query.clientId) {
      queryBuilder = queryBuilder.eq('client_id', query.clientId);
    }
    if (query.serviceId) {
      queryBuilder = queryBuilder.eq('service_id', query.serviceId);
    }
    if (query.providerId) {
      queryBuilder = queryBuilder.eq('provider_id', query.providerId);
    }
    if (query.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }
    if (query.bookingDate) {
      if (query.bookingDate.$gte) {
        queryBuilder = queryBuilder.gte('booking_date', query.bookingDate.$gte.toISOString().split('T')[0]);
      } else {
        queryBuilder = queryBuilder.eq('booking_date', query.bookingDate.toISOString().split('T')[0]);
      }
    }

    const { data, error } = await queryBuilder.single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }

    return data ? new Booking(data) : null;
  }

  static async findById(id) {
    return this.findOne({ id });
  }

  static async find(query = {}) {
    const supabase = getSupabaseClient();
    let queryBuilder = supabase.from('bookings').select('*');

    if (query.clientId) {
      queryBuilder = queryBuilder.eq('client_id', query.clientId);
    }
    if (query.serviceId) {
      queryBuilder = queryBuilder.eq('service_id', query.serviceId);
    }
    if (query.providerId) {
      queryBuilder = queryBuilder.eq('provider_id', query.providerId);
    }
    if (query.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }
    if (query.bookingDate) {
      if (query.bookingDate.$gte) {
        queryBuilder = queryBuilder.gte('booking_date', query.bookingDate.$gte.toISOString().split('T')[0]);
      }
      if (query.bookingDate.$lte) {
        queryBuilder = queryBuilder.lte('booking_date', query.bookingDate.$lte.toISOString().split('T')[0]);
      }
    }

    // Handle sort
    if (query.sort) {
      const sortField = query.sort.bookingDate === -1 ? 'booking_date' : 'booking_date';
      const order = query.sort.bookingDate === -1 ? 'desc' : 'asc';
      queryBuilder = queryBuilder.order(sortField, { ascending: order === 'asc' });
    } else {
      queryBuilder = queryBuilder.order('booking_date', { ascending: false });
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data.map(item => new Booking(item));
  }

  static async countDocuments(query = {}) {
    const supabase = getSupabaseClient();
    let queryBuilder = supabase.from('bookings').select('*', { count: 'exact', head: true });

    if (query.status) {
      if (query.status.$in && Array.isArray(query.status.$in)) {
        // Handle status.$in array - need to use .in() for each status
        // Supabase doesn't support OR directly, so we'll count separately and sum
        // Actually, we can use .in() for array
        queryBuilder = queryBuilder.in('status', query.status.$in);
      } else if (typeof query.status === 'string') {
        queryBuilder = queryBuilder.eq('status', query.status);
      }
    }
    if (query.bookingDate) {
      if (query.bookingDate.$gte) {
        const dateStr = query.bookingDate.$gte instanceof Date 
          ? query.bookingDate.$gte.toISOString().split('T')[0]
          : query.bookingDate.$gte;
        queryBuilder = queryBuilder.gte('booking_date', dateStr);
      }
      if (query.bookingDate.$lte) {
        const dateStr = query.bookingDate.$lte instanceof Date 
          ? query.bookingDate.$lte.toISOString().split('T')[0]
          : query.bookingDate.$lte;
        queryBuilder = queryBuilder.lte('booking_date', dateStr);
      }
    }

    const { count, error } = await queryBuilder;

    if (error) {
      console.error('Booking countDocuments error:', error);
      throw error;
    }
    return count || 0;
  }

  async save() {
    const supabase = getSupabaseClient();
    const bookingData = {
      client_id: this.clientId,
      service_id: this.serviceId,
      provider_id: this.providerId,
      driver_id: this.driverId,
      booking_date: this.bookingDate instanceof Date 
        ? this.bookingDate.toISOString().split('T')[0] 
        : this.bookingDate,
      booking_time: this.bookingTime,
      location: this.location,
      status: this.status,
      payment: this.payment,
      notes: this.notes,
      whatsapp_conversation_id: this.whatsappConversationId,
      updated_at: new Date().toISOString()
    };

    if (this.id) {
      // Update existing booking
      const { data, error } = await supabase
        .from('bookings')
        .update(bookingData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      return new Booking(data);
    } else {
      // Create new booking
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (error) throw error;
      this.id = data.id;
      return new Booking(data);
    }
  }

  async populate(fields) {
    // For Mongoose compatibility - populate is handled in routes
    return this;
  }

  toJSON() {
    return {
      _id: this.id,
      id: this.id,
      clientId: this.clientId,
      serviceId: this.serviceId,
      providerId: this.providerId,
      driverId: this.driverId,
      bookingDate: this.bookingDate,
      bookingTime: this.bookingTime,
      location: this.location,
      status: this.status,
      payment: this.payment,
      notes: this.notes,
      whatsappConversationId: this.whatsappConversationId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  get _id() {
    return this.id;
  }
}

module.exports = Booking;
