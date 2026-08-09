function Login(){
    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
            <form className="flex flex-col gap-4">
            <input
                type="email"
                placeholder="Email"
                className="border rounded px-3 py-2"
            />
            <input
                type="password"
                placeholder="Senha"
                className="border rounded px-3 py-2"
            />
            <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Entrar
            </button>
            </form>
        </div>
        </div>
    );
}
export default Login;