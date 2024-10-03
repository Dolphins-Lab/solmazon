#![allow(clippy::result_large_err)]

use anchor_lang::{prelude::*, solana_program::address_lookup_table::instruction};

declare_id!("4pctDWRVFT6tKCTRG4j3ZQbym77uhzXXSxvMV2UWn4WH");

#[program]
pub mod solmazon {
    use super::*;

    pub fn create_entry(
      // all accounts
      ctx: Context<CreateEntry>,
      // entry data
      title: String,
      description: String,
      link: String,
      price: u64,
      is_active: bool,
      is_expired: bool,
      upvote: u64,
      comment: String,
    ) -> Result<()> {
      let listing_entry = &mut ctx.accounts.listing_entry;
      listing_entry.seller = ctx.accounts.seller.key();
      listing_entry.title = title;
      listing_entry.description = description;
      listing_entry.link = link;
      listing_entry.price = price;
      listing_entry.is_active = is_active;
      listing_entry.is_expired = is_expired;
      listing_entry.upvote = upvote;
      listing_entry.comment = comment;

      Ok(())
    }

    pub fn update_listing(
      
    )



}

#[account]
#[derive(InitSpace)]
pub struct ListingState {
  pub listing_id: u64,
  pub seller: Pubkey,
  #[max_len(20)]
  pub title: String,
  #[max_len(200)]
  pub description: String,
  #[max_len(200)]
  pub link: String,
  pub price: u64,
  pub is_active: bool,
  pub is_expired: bool,
  pub upvote: u64,
  #[max_len(100)]
  pub comment: String,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateListing<'info> {
  #[account(
    init,
    seeds = [title.as_bytes(), seller.key().as_ref()],
    bump,
    payer = seller,
    space = 8 + ListingState::INIT_SPACE,
  )]
  // name of the account
  pub listing_entry: Account<'info, ListingState>,
  // define who is the owner, since account state changes, we have to make this mutable
  #[account(mut)]
  pub seller: Signer<'info>,
  pub system_program: Program<'info, System>,

}


