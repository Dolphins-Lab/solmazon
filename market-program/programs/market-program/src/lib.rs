use anchor_lang::prelude::*;

declare_id!("4CzBqBys17ELPqam6WAye9phgy9tHRz3aNqeuCT4YWUm");

#[program]
pub mod market_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
