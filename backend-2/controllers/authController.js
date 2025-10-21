const db = require('../config/database');
const bcrypt = require('bcrypt');

const authController = {
  // Login de usuario
  login: (req, res) => {
    const { username, password } = req.body;

    console.log('🔐 Intento de login:', { username });

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuario y contraseña son requeridos' 
      });
    }

    db.query('SELECT * FROM usuarios WHERE username = ?', [username], 
      (err, results) => {
        if (err) {
          console.error('❌ Error en consulta de login:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Error del servidor' 
          });
        }

        console.log('📊 Resultados de login:', results);

        if (results.length === 0) {
          console.log('❌ Usuario no encontrado:', username);
          return res.status(401).json({ 
            success: false, 
            message: 'Usuario no encontrado' 
          });
        }

        const user = results[0];
        console.log('👤 Usuario encontrado:', user.username);
        
        // Verificar contraseña
        bcrypt.compare(password, user.password, (err, isPasswordValid) => {
          if (err) {
            console.error('❌ Error comparando contraseñas:', err);
            return res.status(500).json({ 
              success: false, 
              message: 'Error del servidor' 
            });
          }
          
          console.log('🔑 Contraseña válida:', isPasswordValid);
          
          if (!isPasswordValid) {
            return res.status(401).json({ 
              success: false, 
              message: 'Contraseña incorrecta' 
            });
          }

          // Excluir password de la respuesta
          const { password: _, ...userWithoutPassword } = user;

          console.log('✅ Login exitoso para:', user.username);
          res.json({
            success: true,
            message: 'Login exitoso',
            user: userWithoutPassword
          });
        });
      }
    );
  },

  // Registro de nuevo usuario
  register: (req, res) => {
    const { username, password, nombre, email, rol = 'user' } = req.body;

    console.log('📝 Intento de registro:', { username, nombre, email, rol });

    // Validar campos requeridos
    if (!username || !password || !nombre) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuario, contraseña y nombre son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    db.query('SELECT id FROM usuarios WHERE username = ?', [username], 
      (err, existingUsers) => {
        if (err) {
          console.error('❌ Error verificando usuario:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Error del servidor' 
          });
        }

        if (existingUsers.length > 0) {
          console.log('❌ Usuario ya existe:', username);
          return res.status(400).json({ 
            success: false, 
            message: 'El nombre de usuario ya está en uso' 
          });
        }

        // Hash de la contraseña
        bcrypt.hash(password, 10, (err, hashedPassword) => {
          if (err) {
            console.error('❌ Error hasheando contraseña:', err);
            return res.status(500).json({ 
              success: false, 
              message: 'Error del servidor' 
            });
          }

          console.log('🔑 Contraseña hasheada');

          // Insertar nuevo usuario
          db.query(
            'INSERT INTO usuarios (username, password, nombre, email, rol) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, nombre, email, rol],
            (err, result) => {
              if (err) {
                console.error('❌ Error insertando usuario:', err);
                return res.status(500).json({ 
                  success: false, 
                  message: 'Error del servidor en el registro' 
                });
              }

              console.log('✅ Usuario insertado, ID:', result.insertId);

              // Obtener el usuario creado (sin password)
              db.query(
                'SELECT id, username, nombre, email, rol, created_at FROM usuarios WHERE id = ?',
                [result.insertId],
                (err, newUser) => {
                  if (err) {
                    console.error('❌ Error obteniendo usuario:', err);
                    return res.status(500).json({ 
                      success: false, 
                      message: 'Error del servidor' 
                    });
                  }

                  console.log('🎉 Registro exitoso para:', username);

                  res.status(201).json({
                    success: true,
                    message: 'Usuario registrado exitosamente',
                    user: newUser[0]
                  });
                }
              );
            }
          );
        });
      }
    );
  },

  verify: (req, res) => {
    res.json({ success: true, message: 'Sesión válida' });
  }
};

module.exports = authController;