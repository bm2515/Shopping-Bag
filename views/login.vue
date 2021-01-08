<h1>Login</h1>

<form action = "/login" method = "POST"> 

<div>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" 
    required>
</div>

<div>
    <label for="password">Password</label>
    <input type="password" id="password" 
    name="password" required>
</div>
<button type= "submit">Login</button>
</form>
<h2>Please register before your login</h2>
<a href="/register">Register</a>




<h2>Items currently being sold</h2>
<table>
    <tr bgcolor="#4682B4">
    <td height="50" width="50"><font color="white" size = "5">Item Name</font></td>
    <td><font color="white" size = "5">Seller ID</font></td>
    <td><font color="white" size = "5">Price</font></td>
    <td><font color="white" size = "5">Description</font></td>
    <td><font color="white" size = "5">Purchase</font></td>
    </tr>
{{#each items as |i|}}
<tr>

<td style="padding:10px"><font size = "4"> <span class = "item">{{i.ItemName}}</span></font></td>
<td style="padding:10px"><font size = "4"><span class = "seller_ID">{{i.Seller_ID}}</span></font></td>
<td style="padding:10px"><font size = "4"><span class = "price">{{i.Price}}</span></font></td>
<td style="padding:10px"><font size = "4"><span class = "desp" >{{i.Description}}</span></font></td>
<td style="padding:10px"><font size = "4"><button type="button" class = "purchase_btn">Purchase IT!</button></font></td>

</tr>
{{/each}}
</table>




<form>
  <div class="form-group">
    <font size = "10"><strong>Item Name:</strong></font><input type="text" name="ItemName">
  </div>
  <div class="form-group">





    <label for="exampleFormControlSelect1" name="itemcondition"><font size = "10"><strong>Item Condition</strong></font></label>
    <select class="form-control" id="itemcondition">
      <option>1</option>
      <option>2</option>
      <option>3</option>
      <option>4</option>
      <option>5</option>
    </select>
  </div>
  <div class="form-group">
    <label for="description" name = "description">Description</label>
    <textarea class="form-control" id="description" rows="3"></textarea>
  </div>
  <input type="submit">
</form>




Item.find({}, (err, result) => {
                if (err){
                        console.log(err)
                            }
          result = result.filter(result => result.ItemName.toLowerCase() == req.body.itemName.toLowerCase())
    res.render('query.hbs', {items: result});
});