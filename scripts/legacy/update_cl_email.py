#!/usr/bin/env python3
"""
Helper script to update cl_email in the leads database.
Usage: python update_cl_email.py <lead_id> <email>
"""

import sqlite3
import sys
from datetime import datetime

def update_email(lead_id, email):
    """Update the cl_email for a specific lead."""
    db_path = r"C:\Users\mike\Desktop\Comms\leads.db"

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Update the lead
        cursor.execute(
            "UPDATE leads SET cl_email = ?, updated_at = ? WHERE id = ?",
            (email, datetime.now().isoformat(), lead_id)
        )

        conn.commit()
        conn.close()

        print(f"OK - Updated lead {lead_id} with email: {email}")
        return True

    except Exception as e:
        print(f"ERROR - Error updating lead {lead_id}: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python update_cl_email.py <lead_id> <email>")
        sys.exit(1)

    lead_id = int(sys.argv[1])
    email = sys.argv[2]

    success = update_email(lead_id, email)
    sys.exit(0 if success else 1)
