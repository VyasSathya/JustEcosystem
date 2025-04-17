import subprocess
import sys
import socket

def is_port_open(host, port):
    try:
        with socket.create_connection((host, port), timeout=2):
            return True
    except Exception:
        return False

def run_test(script_path, name, required_service=None):
    if required_service:
        host, port = required_service
        if not is_port_open(host, port):
            print(f"❌ {name} service is not reachable at http://{host}:{port}. Please start the service and re-run the test.")
            return False
    print(f"\n▶ Running {name} integration test...")
    result = subprocess.run([sys.executable, script_path], capture_output=True, text=True)
    if result.returncode == 0:
        print(f"✅ {name} integration test passed.")
        return True
    else:
        print(f"❌ {name} integration test failed!")
        print(result.stdout)
        print(result.stderr)
        print(f"Please delegate this issue to the responsible engineer for {name}.")
        return False

def main():
    tests = [
        {
            'name': 'JustWorks Auth API',
            'script': '../integration-tests/test_justworks_auth.py',
            'service': ('localhost', 8000),
            'responsible': 'JustWorks Backend Engineer'
        },
        # Add more integration tests here as needed
    ]
    all_passed = True
    for test in tests:
        passed = run_test(test['script'], test['name'], test.get('service'))
        if not passed:
            all_passed = False
    if all_passed:
        print("\n🎉 All integration tests passed! Interconnectivity is healthy.")
    else:
        print("\n⚠️  Some integration tests failed. See above for details and delegate fixes as indicated.")

if __name__ == '__main__':
    main()
