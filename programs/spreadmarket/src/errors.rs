use anchor_lang::error_code;

#[error_code]
pub enum ErrorCode {
    #[msg("Math overflow or other generic math error")]
    MathErr, // 6000
    #[msg("Strikes must be in ascending order")]
    StrikesOutofOrder, // 6001
    #[msg("Price exceeds threshold")]
    PriceExceedsThreshold, // 6002
}