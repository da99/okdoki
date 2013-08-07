
module Diet_Dot

  def dot_i str = "i", v = nil
    rawdot str, v
  end

  def dot_v str = "v", v = nil
    rawdot str, v
  end

  def inline_rawdot str
    return( capture {
      rawtext(rawdot(str, :inline))
    })
  end

  def rawdot val, v = nil
    str = "[[=#{val}]]"
    if v === :inline
      return str
    end
    text  str + (v || "")
  end

  def dot name, v = ""
    text "[[=data.#{name}]]#{v || ""}"
  end

  def dot_array name
    text "[[~data." + name + " :v:i]]"
    yield
    text "[[~]]"
  end

  def dot_tertiary a, b, c
    rawtext "[[? #{a} ]]"
    rawdot b
    rawtext "[[??]]"
    rawdot c
    rawtext "[[?]]"
  end

end # === module
