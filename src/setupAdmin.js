// Criar ficheiro em src/setupAdmin.js
// Este ficheiro cria o admin user usando a API nativa do Supabase

import { supabase } from './supabaseClient'

export const setupAdminUser = async () => {
  try {
    // Tentar signup do admin
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@myhr.com',
      password: 'admin123'
    })

    if (error) {
      console.error('Erro ao criar user:', error)
      throw error
    }

    console.log('User criado:', data.user.id)

    // Agora criar o profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: data.user.id,
        email: 'admin@myhr.com',
        nome: 'Administrador',
        tipo: 'admin',
        ativo: true
      }])

    if (profileError) {
      console.error('Erro ao criar profile:', profileError)
      throw profileError
    }

    console.log('Admin user criado com sucesso!')
    return { success: true, userId: data.user.id }
  } catch (error) {
    console.error('Erro no setup:', error)
    throw error
  }
}

// Para usar: abra o console do navegador e execute:
// import { setupAdminUser } from './setupAdmin.js'
// setupAdminUser()