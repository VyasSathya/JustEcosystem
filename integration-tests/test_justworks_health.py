import requests

API_URL = 'http://localhost:8000/api/auth'

def test_health():
    try:
        resp = requests.get(f'{API_URL}/health')
        assert resp.status_code == 200, f'Health check failed: {resp.status_code}'
        print('✅ JustWorks Auth API health endpoint is reachable.')
    except Exception as e:
        print(f'❌ JustWorks Auth API health check failed: {e}')
        exit(1)

if __name__ == '__main__':
    test_health()
