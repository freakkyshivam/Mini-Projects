import argon2 from 'argon2'

export const hashedPassword = async (password : string)=>{
    const hashedPassword = await argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 64 * 1024, 
                timeCost: 3,
                parallelism: 1,
            });

            return hashedPassword;
}