const pool = require('../config/db');

class Booking {
    static async getSeats(schedule_id) {
        const query_1 = 'SELECT economy_seat_capacity, business_seat_capacity, platinum_seat_capacity, economy_seats_per_row, business_seats_per_row, platinum_seats_per_row FROM aircraft_model NATURAL JOIN aircraft_instance NATURAL JOIN flight_schedule WHERE schedule_id=$1';
        const capacities = await pool.query(query_1, [schedule_id]);

        const query_2 = 'SELECT seat_id FROM seat_booking NATURAL JOIN passenger_seat WHERE schedule_id=$1';
        const booked_seats = await pool.query(query_2, [schedule_id]);

        const query_3 = 'SELECT model_id FROM aircraft_instance NATURAL JOIN flight_schedule WHERE schedule_id=$1';
        const model_id = await pool.query(query_3, [schedule_id]);

        return [capacities.rows[0], booked_seats.rows, model_id.rows[0]];
    }

    static async createBooking(values){
        if (values.custType !== 'registered'){
            values.custID = null;
            values.custType = 'guest';
        }
        console.log(values);
        const query = 'CALL insertBooking($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)';
        await pool.query(query,[values.custID, values.schedule_id, values.passName, values.passPassport, values.passDob, values.seatNo, values.custName, values.address, values.custDob, values.custGender, values.custPassport, values.mobile, values.custEmail, values.custType]);

    }

}

module.exports = Booking;
