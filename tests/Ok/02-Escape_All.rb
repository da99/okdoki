
require "./tests/helpers"
require "./Server/Ok/Escape_All"

describe ":clean_utf8" do

  it "replaces nb spaces (160 codepoint) with regular ' ' spaces" do
    s = [160, 160,64, 116, 119, 101, 108, 108, 121, 109, 101, 160, 102, 105, 108, 109].
      inject('', :<<)

    assert :==, "@twellyme film", Ok::Escape_All.clean_utf8(s).strip
  end

  it "replaces tabs with spaces" do
    s = "a\t \ta"
    assert :==, "a   a", Ok::Escape_All.clean_utf8(s)
  end

end # === describe :clean_utf8 ===


