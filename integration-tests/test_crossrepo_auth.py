import requests

# Simulate JustStuff or JustCreate calling JustWorks for authentication
JUSTWORKS_AUTH_URL = 'http://localhost:8000/api/auth/login'

def test_crossrepo_login():
    try:
        resp = requests.post(JUSTWORKS_AUTH_URL, json={
            'username': 'demo', 'password': 'demo123'
        })
        assert resp.status_code == 200, f'Expected 200, got {resp.status_code}'
        data = resp.json()
        assert 'token' in data, 'No token in response'
        print('✅ Cross-repo login to JustWorks Auth succeeded.')
    except Exception as e:
        print(f'❌ Cross-repo login to JustWorks Auth failed: {e}')
        exit(1)

if __name__ == '__main__':
    test_crossrepo_login()
