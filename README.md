# Appointment Management System (Oracle + PL/SQL)

Full-stack appointment management system with a strong database-driven design.
Business rules and data integrity are enforced at the database level using Oracle SQL and PL/SQL.

## Architecture
- React (client)
- Flask API (server)
- Oracle Database (SQL / PL-SQL)

Client → API → Database

## Database Design
The relational database schema is implemented in Oracle and includes:
- Primary and foreign keys
- Constraints to enforce data integrity
- Business rules implemented with PL/SQL

📄 [Relational Database Model (PDF)](docs/Relational_model.pdf)

### Schema scripts
- `DB/schema/01_schema.sql` – tables and constraints
- `DB/schema/03_seed.sql` – sample data

### Infrastructure (optional)
- `DB/setup/01_infra.sql` – tablespace, users and roles  
  > Requires DBA privileges. Optional for running the project.

### PL/SQL scripts
- `DB/plsql/` – procedures, functions and triggers implementing database-level logic


### Query scripts
- `DB/queries/kpis.sql` – example analytical and KPI-oriented SQL queries

## PL/SQL Logic
The following business rules are handled at the database level:
- Appointment availability validation
- Prevention of overlapping bookings
- Data consistency enforcement via triggers

## Analytical SQL Queries

The project includes example analytical SQL queries used to compute operational metrics and support data analysis:
- Appointments per doctor per month
- Doctor workload distribution
- Patient appointment frequency
- Peak hours and busiest days

## Scope & Limitations
- Focus on database design and integrity rules
- Authentication and middleware are simplified
- No analytics dashboard included
