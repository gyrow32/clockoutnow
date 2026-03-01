"""
Local SQLite database for lead tracking and email management
"""
import sqlite3
import pandas as pd
from datetime import datetime

class LeadDatabase:
    def __init__(self, db_path='leads.db'):
        self.db_path = db_path
        self.init_database()

    def init_database(self):
        """Initialize database tables"""
        conn = sqlite3.connect(self.db_path)
        c = conn.cursor()

        # Leads table
        c.execute('''
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY,
                company_name TEXT NOT NULL,
                industry TEXT,
                location TEXT,
                phone TEXT,
                cl_url TEXT,
                cl_email TEXT,
                real_email TEXT,
                website TEXT,
                preview_url TEXT,
                status TEXT DEFAULT 'NEW',
                created_at TEXT,
                updated_at TEXT
            )
        ''')

        # Outreach tracking
        c.execute('''
            CREATE TABLE IF NOT EXISTS outreach (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lead_id INTEGER,
                email_sent_at TEXT,
                email_subject TEXT,
                email_body TEXT,
                response_received BOOLEAN DEFAULT 0,
                response_at TEXT,
                notes TEXT,
                FOREIGN KEY (lead_id) REFERENCES leads(id)
            )
        ''')

        # Image generation tracking
        c.execute('''
            CREATE TABLE IF NOT EXISTS images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                lead_id INTEGER,
                image_prompt TEXT,
                image_path TEXT,
                generated_at TEXT,
                FOREIGN KEY (lead_id) REFERENCES leads(id)
            )
        ''')

        conn.commit()
        conn.close()
        print(f"Database initialized: {self.db_path}")

    def import_from_excel(self, excel_path='chrissy-cl-leads.xlsx'):
        """Import leads from Excel into database"""
        df = pd.read_excel(excel_path)
        conn = sqlite3.connect(self.db_path)

        for idx, row in df.iterrows():
            conn.execute('''
                INSERT OR REPLACE INTO leads
                (id, company_name, industry, location, phone, cl_url, real_email, website, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                int(row['No.']),
                row['Company Name'],
                row['Industry'],
                row['City / Region'],
                row['Phone'] if pd.notna(row['Phone']) else None,
                row['Craigslist URL'],
                row['Email'] if pd.notna(row['Email']) else None,
                row['Website'] if pd.notna(row['Website']) else None,
                datetime.now().isoformat(),
                datetime.now().isoformat()
            ))

        conn.commit()
        count = conn.execute('SELECT COUNT(*) FROM leads').fetchone()[0]
        conn.close()

        print(f"Imported {count} leads from Excel")
        return count

    def update_cl_email(self, lead_id, cl_email):
        """Update Craigslist anonymous email for a lead"""
        conn = sqlite3.connect(self.db_path)
        conn.execute('''
            UPDATE leads
            SET cl_email = ?, updated_at = ?
            WHERE id = ?
        ''', (cl_email, datetime.now().isoformat(), lead_id))
        conn.commit()
        conn.close()

    def get_leads_without_cl_email(self):
        """Get all leads that don't have CL email yet"""
        conn = sqlite3.connect(self.db_path)
        df = pd.read_sql_query('''
            SELECT id, company_name, cl_url
            FROM leads
            WHERE cl_email IS NULL AND cl_url IS NOT NULL
        ''', conn)
        conn.close()
        return df

    def export_to_excel(self, output_path='chrissy-cl-leads.xlsx'):
        """Export database back to Excel"""
        conn = sqlite3.connect(self.db_path)
        df = pd.read_sql_query('SELECT * FROM leads', conn)
        conn.close()
        df.to_excel(output_path, index=False)
        print(f"Exported to: {output_path}")

if __name__ == '__main__':
    # Initialize database
    db = LeadDatabase()

    # Import from Excel
    db.import_from_excel()

    # Show leads needing CL emails
    missing = db.get_leads_without_cl_email()
    print(f"\n{len(missing)} leads need CL email extraction")
    print(missing.head())
