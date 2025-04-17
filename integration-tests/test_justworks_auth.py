import requests

API_URL = 'http://localhost:8000/api/auth'

def test_login_success():
    resp = requests.post(f'{API_URL}/login', json={
        'username': 'demo', 'password': 'demo123'
    })
    assert resp.status_code == 200, f'Expected 200, got {resp.status_code}'
    assert 'token' in resp.json(), 'No token in response'

def test_login_failure():
    resp = requests.post(f'{API_URL}/login', json={
        'username': 'baduser', 'password': 'badpass'
    })
    assert resp.status_code == 401, f'Expected 401, got {resp.status_code}'

def test_me_unauth():
    resp = requests.get(f'{API_URL}/me')
    assert resp.status_code == 401, f'Expected 401, got {resp.status_code}'

if __name__ == '__main__':
    test_login_success()
    test_login_failure()
    test_me_unauth()
    print('All integration tests passed.')
