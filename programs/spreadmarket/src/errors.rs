use anchor_lang::error_code;

#[error_code]
pub enum ErrorCode {
    #[msg("Math overflow or other generic math error")]
    MathErr, // 6000

}