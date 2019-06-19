describe('.env', () => {

  test('ELASTIC_SEARCH_USER_NAME should be defined', () => {
    expect(process.env.ELASTIC_SEARCH_USER_NAME).toBeDefined();

  });

  test('ELASTIC_SEARCH_PASSWORD should be defined', () => {
    expect(process.env.ELASTIC_SEARCH_PASSWORD).toBeDefined();
  });

  test('ELASTIC_SEARCH_ADDRESS should be defined', () => {
    expect(process.env.ELASTIC_SEARCH_ADDRESS).toBeDefined();
  });

  test('ELASTIC_SEARCH_PORT should be defined', () => {
    expect(process.env.ELASTIC_SEARCH_PORT).toBeDefined();
  });

  test('ELASTIC_SEARCH_INDEX should be defined', () => {
    expect(process.env.ELASTIC_SEARCH_INDEX).toBeDefined();
  });

});
