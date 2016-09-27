describe('visu spec : ', function() {
  
  before(function() {
    var html = document.createElement('visu');
    document.body.appendChild(html);
    tag = riot.mount('visu')[0];
  });
  
  it('mounts a visu tag', function() {
    expect(tag).to.exist;
  })
  
  describe('with cytoscape imported : ', function() {
    
    it('cytoscape context is created', function() {
       expect(tag.cy).to.exist;
    });
  });
});

