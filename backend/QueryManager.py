def select_all_from_target_table(target, column=None, value=None):
    if column is None:
        data = target.query.all()
    else:
        data = target.query.filter(column == value).all()

    return data