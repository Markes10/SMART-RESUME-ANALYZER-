"""
Command line interface for HR AI Platform
"""
import os
import sys
from getpass import getpass
from services.resume_service import resume_service
from services.user_service import user_service
from services.job_service import job_service

def print_menu():
    """Print main menu"""
    print("\nHR AI Platform CLI")
    print("1. Resume Operations")
    print("2. Job Operations")
    print("3. User Operations")
    print("0. Exit")
    return input("Select an option: ")

def resume_menu():
    """Resume operations menu"""
    while True:
        print("\nResume Operations")
        print("1. Upload Resume")
        print("2. List User Resumes")
        print("3. Match Jobs")
        print("0. Back")
        choice = input("Select an option: ")

        if choice == "1":
            user_id = int(input("Enter user ID: "))
            file_path = input("Enter resume file path: ")
            try:
                with open(file_path, 'r') as f:
                    resume_text = f.read()
                result = resume_service.create_resume(user_id, resume_text)
                print("Resume uploaded successfully!")
                print(result)
            except Exception as e:
                print(f"Error: {e}")

        elif choice == "2":
            user_id = int(input("Enter user ID: "))
            resumes = resume_service.get_user_resumes(user_id)
            for resume in resumes:
                print(f"\nResume ID: {resume['id']}")
                print(f"Skills: {resume['skills']}")
                print(f"Created at: {resume['created_at']}")

        elif choice == "3":
            resume_id = int(input("Enter resume ID: "))
            top_k = int(input("Enter number of matches to return: "))
            matches = resume_service.match_jobs(resume_id, top_k)
            for match in matches:
                print(f"\nJob: {match['job']['title']}")
                print(f"Match score: {match['match_score']:.2f}")
                print(f"Matching skills: {match['matching_skills']}")
                print(f"Missing skills: {match['missing_skills']}")

        elif choice == "0":
            break

def job_menu():
    """Job operations menu"""
    while True:
        print("\nJob Operations")
        print("1. Create Job")
        print("2. List Jobs")
        print("0. Back")
        choice = input("Select an option: ")

        if choice == "1":
            title = input("Enter job title: ")
            description = input("Enter job description: ")
            skills = input("Enter required skills (comma-separated): ").split(",")
            department = input("Enter department: ")
            
            result = job_service.create_job({
                'title': title,
                'description': description,
                'required_skills': skills,
                'department': department
            })
            print("Job created successfully!")
            print(result)

        elif choice == "2":
            jobs = job_service.get_all()
            for job in jobs:
                print(f"\nJob ID: {job['id']}")
                print(f"Title: {job['title']}")
                print(f"Department: {job['department']}")
                print(f"Required skills: {job['required_skills']}")

        elif choice == "0":
            break

def user_menu():
    """User operations menu"""
    while True:
        print("\nUser Operations")
        print("1. Create User")
        print("2. List Users")
        print("0. Back")
        choice = input("Select an option: ")

        if choice == "1":
            username = input("Enter username: ")
            email = input("Enter email: ")
            password = getpass("Enter password: ")
            role = input("Enter role (employee/hr/admin): ")
            
            result = user_service.create_user({
                'username': username,
                'email': email,
                'password': password,
                'role': role
            })
            print("User created successfully!")
            print(result)

        elif choice == "2":
            users = user_service.get_all()
            for user in users:
                print(f"\nUser ID: {user['id']}")
                print(f"Username: {user['username']}")
                print(f"Email: {user['email']}")
                print(f"Role: {user['role']}")

        elif choice == "0":
            break

def main():
    """Main CLI loop"""
    while True:
        choice = print_menu()
        
        if choice == "1":
            resume_menu()
        elif choice == "2":
            job_menu()
        elif choice == "3":
            user_menu()
        elif choice == "0":
            print("Goodbye!")
            sys.exit(0)
        else:
            print("Invalid option")

if __name__ == "__main__":
    main()
