import { GET, POST } from './route';
import { getSession } from '@/lib/auth';
import { listarUsuarios, crearUsuario, actualizarUsuario } from '@/lib/users';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('@/lib/auth');
jest.mock('@/lib/users');
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('GET /api/usuarios', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 403 if session is not present', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);
    (NextResponse.json as jest.Mock).mockReturnValue({ status: 403, body: { error: "Acceso denegado: se requieren permisos de administrador." } });

    const response = await GET();

    expect(getSession).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Acceso denegado: se requieren permisos de administrador.' },
      { status: 403 }
    );
    expect(response).toEqual({ status: 403, body: { error: "Acceso denegado: se requieren permisos de administrador." } });
  });

  it('should return 403 if user is not admin', async () => {
    (getSession as jest.Mock).mockResolvedValue({ role: 'evaluador' });
    (NextResponse.json as jest.Mock).mockReturnValue({ status: 403, body: { error: "Acceso denegado: se requieren permisos de administrador." } });

    const response = await GET();

    expect(getSession).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Acceso denegado: se requieren permisos de administrador.' },
      { status: 403 }
    );
    expect(response).toEqual({ status: 403, body: { error: "Acceso denegado: se requieren permisos de administrador." } });
  });

  it('should return the list of users if user is admin', async () => {
    const mockUsers = [{ id: '1', username: 'test' }];
    (getSession as jest.Mock).mockResolvedValue({ role: 'admin' });
    (listarUsuarios as jest.Mock).mockReturnValue(mockUsers);
    (NextResponse.json as jest.Mock).mockReturnValue({ status: 200, body: mockUsers });

    const response = await GET();

    expect(getSession).toHaveBeenCalledTimes(1);
    expect(listarUsuarios).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(mockUsers);
    expect(response).toEqual({ status: 200, body: mockUsers });
  });
});

describe('POST /api/usuarios', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const createRequest = (body: any) =>
    ({
      json: jest.fn().mockResolvedValue(body),
    } as unknown as NextRequest);

  it('should return 403 if session is not present', async () => {
    (getSession as jest.Mock).mockResolvedValue(null);
    (NextResponse.json as jest.Mock).mockReturnValue({ status: 403, body: { error: "Acceso denegado: solo administradores pueden registrar nuevos usuarios." } });

    const req = createRequest({});
    const response = await POST(req);

    expect(getSession).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Acceso denegado: solo administradores pueden registrar nuevos usuarios.' },
      { status: 403 }
    );
    expect(response).toEqual({ status: 403, body: { error: "Acceso denegado: solo administradores pueden registrar nuevos usuarios." } });
  });

  it('should return 403 if user is not admin', async () => {
    (getSession as jest.Mock).mockResolvedValue({ role: 'evaluador' });
    (NextResponse.json as jest.Mock).mockReturnValue({ status: 403, body: { error: "Acceso denegado: solo administradores pueden registrar nuevos usuarios." } });

    const req = createRequest({});
    const response = await POST(req);

    expect(getSession).toHaveBeenCalledTimes(1);
    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Acceso denegado: solo administradores pueden registrar nuevos usuarios.' },
      { status: 403 }
    );
    expect(response).toEqual({ status: 403, body: { error: "Acceso denegado: solo administradores pueden registrar nuevos usuarios." } });
  });

  it('should return 400 if validation fails', async () => {
    (getSession as jest.Mock).mockResolvedValue({ role: 'admin' });
    (NextResponse.json as jest.Mock).mockReturnValue({ status: 400, body: { error: "El usuario debe tener al menos 3 caracteres." } });

    const req = createRequest({ username: 'ab' });
    const response = await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'El usuario debe tener al menos 3 caracteres.' },
      { status: 400 }
    );
    expect(response).toEqual({ status: 400, body: { error: "El usuario debe tener al menos 3 caracteres." } });
  });

  it('should return 400 if user creation fails', async () => {
    (getSession as jest.Mock).mockResolvedValue({ role: 'admin' });
    (crearUsuario as jest.Mock).mockRejectedValue(new Error('User already exists.'));
    (NextResponse.json as jest.Mock).mockReturnValue({ status: 400, body: { error: "User already exists." } });

    const req = createRequest({
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
      password: 'password123',
    });
    const response = await POST(req);

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'User already exists.' },
      { status: 400 }
    );
    expect(response).toEqual({ status: 400, body: { error: "User already exists." } });
  });

  it('should return 201 on successful user creation', async () => {
    const mockUser = { id: '1', username: 'testuser', role: 'admin' };
    (getSession as jest.Mock).mockResolvedValue({ role: 'admin' });
    (crearUsuario as jest.Mock).mockResolvedValue(mockUser);
    (NextResponse.json as jest.Mock).mockReturnValue({ status: 201, body: mockUser });

    const req = createRequest({
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
      password: 'password123',
    });
    const response = await POST(req);

    expect(crearUsuario).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
      password: 'password123',
    });
    expect(NextResponse.json).toHaveBeenCalledWith(mockUser, { status: 201 });
    expect(response).toEqual({ status: 201, body: mockUser });
  });

  it('should return 201 and update user if optional fields are provided', async () => {
    const mockUser = { id: '1', username: 'testuser', role: 'admin' };
    const updatedUser = { ...mockUser, cargo: 'Developer', telefono: '123456789' };
    (getSession as jest.Mock).mockResolvedValue({ role: 'admin' });
    (crearUsuario as jest.Mock).mockResolvedValue(mockUser);
    (actualizarUsuario as jest.Mock).mockReturnValue(updatedUser);
    (NextResponse.json as jest.Mock).mockReturnValue({ status: 201, body: updatedUser });

    const req = createRequest({
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
      password: 'password123',
      cargo: 'Developer',
      telefono: '123456789',
    });
    const response = await POST(req);

    expect(crearUsuario).toHaveBeenCalled();
    expect(actualizarUsuario).toHaveBeenCalledWith('1', { cargo: 'Developer', telefono: '123456789' });
    expect(NextResponse.json).toHaveBeenCalledWith(updatedUser, { status: 201 });
    expect(response).toEqual({ status: 201, body: updatedUser });
  });
});
