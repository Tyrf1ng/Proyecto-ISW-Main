import { useNavigate } from 'react-router-dom';
import { login } from '@services/auth.service.js';
import Stack from '@mui/material/Stack';
import useLogin from '@hooks/auth/useLogin.jsx';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import SchoolIcon from '@mui/icons-material/School';
import '@styles/form.css';
import { Box,Button, TextField, Typography } from '@mui/material';


const Login = () => {
    const navigate = useNavigate();
    const {
        errorEmail,
        errorPassword,
        errorData,
        handleInputChange,
        inputData
    } = useLogin();

    const loginSubmit = async (event) => {
        event.preventDefault();
        const data = {
            email: inputData.email,
            password: inputData.password,
        };

        try {
            const response = await login(data);
            if (response.status === 'Success') {
                navigate('/Cursos');
            } else if (response.status === 'Client error') {
                errorData(response.details);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Stack sx={{backgroundImage:'radial-gradient(at 50% 50%, #002952, #090B11)', display:'flex', height:'100vh', justifyContent:'center', alignItems:'center'}}>
            <Stack sx={{backgroundColor:'#060D18', borderRadius:10, height:'50%', width:'30%', alignItems:'center', justifyContent:'center'}}> 
                <Stack>
                    <SchoolIcon sx={{ fontSize: 100, color:'#FFF', alignSelf:'center', justifyContent:'center'}} />
                    <Typography variant='h4' sx={{textAlign:'center', color:'white', fontWeight:'bold'}}>Bienvenido!</Typography>
                </Stack>
                <Box sx={{ fontSize: 30, fontWeight: 'bold', marginTop:5 }}>
                    <TextField
                        id="email"
                        label="Email"
                        placeholder='Example@gmail.com'
                        variant="outlined"
                        name="email"
                        size='normal'
                        slotProps={{
                            input: {
                                style: { color: 'white' },
                                startAdornment: <EmailIcon sx={{paddingRight:2}} />
                            }
                        }}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        error={errorEmail}
                        helperText={errorEmail ? 'Email is required' : ''}/>
                </Box>
                <Box sx={{ fontSize: 30, fontWeight: 'bold', paddingTop:3 }}>
                    <TextField
                        id="password"
                        label="Password"
                        placeholder='******'
                        type='password'
                        variant="outlined"
                        name="email"
                        size='normal'
                        autoComplete='current-password'
                        slotProps={{
                            input: {
                                style: { color: 'white' },
                                startAdornment: <KeyIcon sx={{paddingRight:2}} />
                            }
                        }}
                        
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        error={errorPassword}
                        helperText={errorPassword ? 'Password is required' : ''}/>
                </Box>
                <Button variant="contained" sx={{marginTop:3}} onClick={loginSubmit}>Iniciar Sesion</Button>
          </Stack>
        </Stack>
    );
};

export default Login;