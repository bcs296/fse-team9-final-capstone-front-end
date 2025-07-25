export function LoginForm(params) {

    const handleChange = (event) => {
        let newCredentials = { ...params.credentials };
        newCredentials[event.target.name] = event.target.value;
        params.setCredentials(newCredentials);
    };

    return (
        <div style={{ maxWidth: "unset" }}>         
            <div className={(params.currentUser) ? "hidden" : "visible"}>
                <div>
                    <label htmlFor="user">User: </label>
                    <br />
                    <input type="text" size={10} id="user" name="user" value={params.credentials.user} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    <br />
                    <input 
                        type="password" 
                        size={10} 
                        id="password" 
                        name="password" 
                        value={params.credentials.password} 
                        onChange={handleChange}
                        autoComplete="current-password"
                        style={{ fontFamily: 'monospace' }}
                    />
                </div>
            </div>
            <button id="loginButton" onClick={params.login}>
                {(params.currentUser) ? "Logout" : "Login"}
            </button>
            &nbsp;User: <span style={{ fontWeight: "bold" }} >{(params.currentUser) ? params.currentUser.user : "not logged in"}</span>
        </div>
    );
}