import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:mockito/mockito.dart';
import 'package:your_app/services/auth_service.dart';

class MockClient extends Mock implements http.Client {}

void main() {
  group('AuthService', () {
    late AuthService authService;
    late MockClient mockClient;

    setUp(() {
      mockClient = MockClient();
      authService = AuthService(client: mockClient);
    });

    test('login returns true on successful login', () async {
      when(mockClient.post(any, body: anyNamed('body')))
          .thenAnswer((_) async => http.Response('{"token": "fake_token"}', 200));

      final result = await authService.login('test@example.com', 'password');
      expect(result, true);
    });

    test('login returns false on failed login', () async {
      when(mockClient.post(any, body: anyNamed('body')))
          .thenAnswer((_) async => http.Response('{"message": "Invalid credentials"}', 401));

      final result = await authService.login('test@example.com', 'wrong_password');
      expect(result, false);
    });
  });
}
