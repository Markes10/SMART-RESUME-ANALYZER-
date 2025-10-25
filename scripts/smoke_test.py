"""Cross-platform smoke test for auth flows against the running server.
Usage: python scripts/smoke_test.py
"""
import requests
from pprint import pprint

BASE = "http://127.0.0.1:8000"

def register(user):
    r = requests.post(f"{BASE}/auth/register", json=user)
    try:
        pprint(r.json())
    except Exception:
        print(r.text)
    return r

def login(username, password):
    r = requests.post(f"{BASE}/auth/token", data={"username": username, "password": password})
    try:
        pprint(r.json())
    except Exception:
        print(r.text)
    return r

def me(token):
    r = requests.get(f"{BASE}/auth/users/me", headers={"Authorization": f"Bearer {token}"})
    try:
        pprint(r.json())
    except Exception:
        print(r.text)
    return r

def update_me(token, payload):
    r = requests.put(f"{BASE}/auth/users/me", json=payload, headers={"Authorization": f"Bearer {token}"})
    try:
        pprint(r.json())
    except Exception:
        print(r.text)
    return r

def list_users(token):
    r = requests.get(f"{BASE}/auth/users", headers={"Authorization": f"Bearer {token}"})
    try:
        pprint(r.json())
    except Exception:
        print(r.text)
    return r

def main():
    emp = {"username":"smoke_emp","email":"smoke_emp@example.com","password":"Password123!","role":"employee"}
    adm = {"username":"smoke_admin","email":"smoke_admin@example.com","password":"AdminPass123!","role":"admin"}

    print("--- register employee ---")
    register(emp)

    print("--- login employee ---")
    r = login(emp["username"], emp["password"])
    emp_token = r.json().get("access_token") if r.status_code == 200 else None

    if emp_token:
        print("--- get me ---")
        me(emp_token)

        print("--- update me ---")
        update_me(emp_token, {"username":"smoke_emp2","email":"smoke_emp2@example.com"})

    print("--- register admin ---")
    register(adm)

    print("--- login admin ---")
    r2 = login(adm["username"], adm["password"])
    admin_token = r2.json().get("access_token") if r2.status_code == 200 else None

    if admin_token:
        print("--- admin list users ---")
        list_users(admin_token)

    print("--- done ---")

if __name__ == '__main__':
    main()
